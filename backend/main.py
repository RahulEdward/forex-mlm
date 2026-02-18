from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth
from routers import referral
from utils import generate_referral_code
from services.referral_service import ReferralService
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(referral.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_super_admin():
    db = next(get_db())
    super_admin = db.query(models.User).filter(models.User.role == "super_admin").first()
    if not super_admin:
        super_admin = models.User(
            email="superadmin@example.com",
            username="superadmin",
            hashed_password=auth.get_password_hash("superadmin123"),
            role="super_admin",
            is_active=True,
            permissions={},
            referral_code="SUPERADMIN"
        )
        db.add(super_admin)
        db.commit()

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.role in ["super_admin", "admin"]:
        raise HTTPException(status_code=400, detail="Cannot register as admin or super_admin")
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Referral Logic
    referrer_id = None
    if user.referral_code:
        referrer = db.query(models.User).filter(models.User.referral_code == user.referral_code).first()
        if referrer:
            referrer_id = referrer.id
    
    # Generate unique referral code
    new_referral_code = generate_referral_code()
    while db.query(models.User).filter(models.User.referral_code == new_referral_code).first():
        new_referral_code = generate_referral_code()

    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=auth.get_password_hash(user.password),
        role="user",
        is_active=True,
        permissions={},
        referral_code=new_referral_code,
        referred_by_id=referrer_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize Referral Stats
    new_stats = models.ReferralStat(user_id=new_user.id)
    db.add(new_stats)
    db.commit()

    # Propagate stats to uplines (async in production)
    if referrer_id:
        ReferralService.propagate_stats_update(db, new_user.id)

    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/api/admin/create", response_model=schemas.UserResponse)
def create_admin(
    admin_data: schemas.AdminCreate,
    current_user: models.User = Depends(auth.require_role(["super_admin"])),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == admin_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_admin = models.User(
        email=admin_data.email,
        username=admin_data.username,
        hashed_password=auth.get_password_hash(admin_data.password),
        role="admin",
        is_active=True,
        permissions=admin_data.permissions,
        created_by=current_user.id
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@app.get("/api/users")
def get_users(
    current_user: models.User = Depends(auth.require_role(["super_admin", "admin"])),
    db: Session = Depends(get_db)
):
    if current_user.role == "super_admin":
        users = db.query(models.User).all()
    else:
        users = db.query(models.User).filter(models.User.role == "user").all()
    return users

@app.get("/")
def read_root():
    return {"message": "Role-Based Auth API"}
