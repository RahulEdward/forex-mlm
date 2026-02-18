from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # super_admin, admin, user
    is_active = Column(Boolean, default=True)
    permissions = Column(JSON, default=dict)  # For admin permissions
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Referral System Fields
    referral_code = Column(String, unique=True, index=True, nullable=True)
    referred_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    creator = relationship("User", remote_side=[id], foreign_keys=[created_by])
    referrer = relationship("User", remote_side=[id], foreign_keys=[referred_by_id], backref="direct_referrals")
    referral_stats = relationship("ReferralStat", back_populates="user", uselist=False, cascade="all, delete-orphan")
    broker_account = relationship("BrokerAccount", back_populates="user", uselist=False, cascade="all, delete-orphan")

class ReferralStat(Base):
    __tablename__ = "referral_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    total_directs = Column(Integer, default=0)
    total_team_size = Column(Integer, default=0)  # Total downline across 20 levels
    level_breakdown = Column(JSON, default=dict)  # e.g., {"1": 5, "2": 10}
    
    user = relationship("User", back_populates="referral_stats")

class BrokerAccount(Base):
    __tablename__ = "broker_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    broker_name = Column(String, nullable=False)
    client_id = Column(String, nullable=False)
    encrypted_api_key = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="broker_account")
