from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_chat(db: Session, chat: schemas.ChatCreate, user_id: int):
    db_chat = models.Chat(
        title=chat.title,
        user_id=user_id
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_user_chats(db: Session, user_id: int):
    return db.query(models.Chat).filter(models.Chat.user_id == user_id).order_by(models.Chat.created_at.desc()).all()

def get_chat_with_messages(db: Session, chat_id: int, user_id: int):
    chat = db.query(models.Chat).filter(
        models.Chat.id == chat_id,
        models.Chat.user_id == user_id
    ).first()
    return chat

def create_message(db: Session, content: str, sender_type: models.SenderType, chat_id: int, user_id: int = None, agent_id: int = None):
    db_message = models.Message(
        content=content,
        sender_type=sender_type,
        chat_id=chat_id,
        user_sender_id=user_id,
        agent_sender_id=agent_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_or_create_ai_agent(db: Session):
    agent = db.query(models.AIAgent).first()
    if not agent:
        agent = models.AIAgent(role="assistant")
        db.add(agent)
        db.commit()
        db.refresh(agent)
    return agent