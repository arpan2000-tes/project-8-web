from sqlalchemy import Column, Integer , String , Boolean
from app.db.base import Base

class user(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    otp_secret = Column(String)
    is_verified = Column(Boolean, default=False)