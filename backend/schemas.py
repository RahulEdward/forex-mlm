from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: str = "user"
    referral_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: str
    is_active: bool
    referral_code: Optional[str]
    referred_by_id: Optional[int]
    permissions: Optional[Dict] = {}
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class AdminCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    permissions: Dict

class ReferralStatsResponse(BaseModel):
    total_directs: int
    total_team_size: int
    level_breakdown: Dict[str, int]

    class Config:
        from_attributes = True

class BrokerAccountResponse(BaseModel):
    broker_name: str
    client_id: str
    is_active: bool

    class Config:
        from_attributes = True
