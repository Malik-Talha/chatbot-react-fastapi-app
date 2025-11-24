from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import socketio

from .database import engine, get_db, Base
from . import models, schemas, crud
from .auth import verify_password, create_access_token, get_current_user
from .socketio_handler import sio

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running"}

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud.create_user(db=db, user=user)
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/api/chats", response_model=schemas.ChatResponse)
def create_chat(
    chat: schemas.ChatCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_chat(db=db, chat=chat, user_id=current_user.id)

@app.get("/api/chats", response_model=list[schemas.ChatResponse])
def get_chats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_user_chats(db=db, user_id=current_user.id)

@app.get("/api/chats/{chat_id}", response_model=schemas.ChatWithMessages)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chat = crud.get_chat_with_messages(db=db, chat_id=chat_id, user_id=current_user.id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

# Export the socket app as the main app
app = socket_app