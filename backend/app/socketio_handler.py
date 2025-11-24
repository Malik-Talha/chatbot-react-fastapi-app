import socketio
import asyncio
from sqlalchemy.orm import Session
from .database import SessionLocal
from .auth import decode_token
from . import crud, models

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Store user sessions
user_sessions = {}

async def mock_ai_response(user_message: str, stream: bool = False):
    """Mock AI response generator"""
    responses = [
        f"I understand you said: '{user_message}'. How can I help you further?",
        f"That's interesting! Regarding '{user_message}', let me think...",
        f"Thanks for sharing that. Based on '{user_message}', here's my thought...",
        f"I see you mentioned '{user_message}'. Let me provide some insight on that.",
    ]
    
    import random
    response = random.choice(responses)
    
    if stream:
        # Simulate streaming word by word
        words = response.split()
        for i, word in enumerate(words):
            await asyncio.sleep(0.1)  # Simulate typing delay
            yield word + (" " if i < len(words) - 1 else "")
    else:
        await asyncio.sleep(1)  # Simulate processing time
        yield response

@sio.event
async def connect(sid, environ, auth):
    print(f"Client connected: {sid}")
    
    # Authenticate user
    if auth and 'token' in auth:
        token = auth['token']
        payload = decode_token(token)
        if payload:
            user_id = payload.get('sub')
            user_sessions[sid] = {'user_id': int(user_id)}
            print(f"User {user_id} authenticated")
            return True
    
    print(f"Authentication failed for {sid}")
    return False

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in user_sessions:
        del user_sessions[sid]

@sio.event
async def send_message(sid, data):
    """Handle incoming messages from client"""
    if sid not in user_sessions:
        await sio.emit('error', {'message': 'Not authenticated'}, to=sid)
        return
    
    user_id = user_sessions[sid]['user_id']
    message_content = data.get('content')
    chat_id = data.get('chat_id')
    stream = data.get('stream', False)
    
    db: Session = SessionLocal()
    try:
        # Save user message
        user_message = crud.create_message(
            db=db,
            content=message_content,
            sender_type=models.SenderType.USER,
            chat_id=chat_id,
            user_id=user_id
        )
        
        # Emit user message back to confirm
        await sio.emit('message_saved', {
            'id': user_message.id,
            'content': user_message.content,
            'sender_type': 'user',
            'created_at': user_message.created_at.isoformat(),
            'chat_id': chat_id
        }, to=sid)
        
        # Get AI agent
        agent = crud.get_or_create_ai_agent(db)
        
        # Generate AI response
        if stream:
            # Streaming mode
            full_response = ""
            await sio.emit('ai_stream_start', {'chat_id': chat_id}, to=sid)
            
            async for chunk in mock_ai_response(message_content, stream=True):
                full_response += chunk
                await sio.emit('ai_stream_chunk', {
                    'chunk': chunk,
                    'chat_id': chat_id
                }, to=sid)
            
            # Save complete AI message
            ai_message = crud.create_message(
                db=db,
                content=full_response,
                sender_type=models.SenderType.AI,
                chat_id=chat_id,
                agent_id=agent.id
            )
            
            await sio.emit('ai_stream_end', {
                'id': ai_message.id,
                'content': ai_message.content,
                'sender_type': 'ai',
                'created_at': ai_message.created_at.isoformat(),
                'chat_id': chat_id
            }, to=sid)
        else:
            # Complete message mode
            async for response in mock_ai_response(message_content, stream=False):
                ai_message = crud.create_message(
                    db=db,
                    content=response,
                    sender_type=models.SenderType.AI,
                    chat_id=chat_id,
                    agent_id=agent.id
                )
                
                await sio.emit('message_saved', {
                    'id': ai_message.id,
                    'content': ai_message.content,
                    'sender_type': 'ai',
                    'created_at': ai_message.created_at.isoformat(),
                    'chat_id': chat_id
                }, to=sid)
    
    finally:
        db.close()

@sio.event
async def join_chat(sid, data):
    """Join a specific chat room"""
    chat_id = data.get('chat_id')
    await sio.enter_room(sid, f"chat_{chat_id}")
    print(f"User {sid} joined chat {chat_id}")