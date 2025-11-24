from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from .models import SenderType

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ChatResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str
    chat_id: int

class MessageResponse(BaseModel):
    id: int
    content: str
    sender_type: SenderType
    created_at: datetime
    chat_id: int
    
    class Config:
        from_attributes = True

class ChatWithMessages(BaseModel):
    id: int
    title: str
    created_at: datetime
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True