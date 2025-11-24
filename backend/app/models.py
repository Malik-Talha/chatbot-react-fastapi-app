from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class SenderType(str, enum.Enum):
    USER = "user"
    AI = "ai"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    
    chats = relationship("Chat", back_populates="owner")

class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class AIAgent(Base):
    __tablename__ = "ai_agents"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, default="assistant")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    sender_type = Column(SQLEnum(SenderType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    user_sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    agent_sender_id = Column(Integer, ForeignKey("ai_agents.id"), nullable=True)
    
    chat = relationship("Chat", back_populates="messages")