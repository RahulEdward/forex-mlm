from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import models, schemas, auth
from services.referral_service import ReferralService

router = APIRouter(
    prefix="/api/referral",
    tags=["referral"]
)

@router.get("/admin/tree", response_model=List[dict])
def get_admin_tree(
    user_id: Optional[int] = None,
    depth: int = 3,
    current_user: models.User = Depends(auth.require_role(["super_admin"])),
    db: Session = Depends(get_db)
):
    """
    Admin: Get referral tree for ANY user, or global forest if user_id is None.
    If user_id is provided, acts like get_referral_tree for that user.
    If user_id is None, finds all root users (referred_by_id IS NULL) and builds forest.
    """
    if depth > 20: 
        raise HTTPException(status_code=400, detail="Max depth is 20")
    
    # If user_id is None, we need a slight modification to the service or call it differently
    # The current service expects a root_user_id. 
    # If we pass None, it filters by referred_by_id == None, which finds all roots.
    # PRO TIP: The recursion works fine starting from multiple roots (SQLAlchemy/Postgres handles this).
    
    tree = ReferralService.get_referral_tree(db, user_id, max_depth=depth)
    return tree

@router.get("/admin/stats", response_model=dict)
def get_admin_stats(
    current_user: models.User = Depends(auth.require_role(["super_admin"])),
    db: Session = Depends(get_db)
):
    """
    Admin: System-wide referral stats.
    """
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.is_active == True).count()
    users_with_referrals = db.query(models.User).filter(models.User.referral_code != None).count() # Everyone has one now
    
    # Example stat: Total referral connections
    total_referrals = db.query(models.User).filter(models.User.referred_by_id != None).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_referrals_made": total_referrals,
    }

@router.get("/tree", response_model=List[dict])
def get_referral_tree(
    depth: int = 3,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the referral tree for the current user.
    """
    if depth > 20:
        raise HTTPException(status_code=400, detail="Max depth is 20")
    
    # Logic: get downline
    # We use a custom service to handle recursive queries
    # In a real app, this should return a nested structure or flat list with level indicators
    # The service returns a list of users with 'level'
    
    tree = ReferralService.get_referral_tree(db, current_user.id, max_depth=depth)
    return tree

@router.get("/stats", response_model=schemas.ReferralStatsResponse)
def get_referral_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get referral statistics for current user.
    If stats are missing, calculate them on the fly (or return defaults).
    """
    stat = db.query(models.ReferralStat).filter(models.ReferralStat.user_id == current_user.id).first()
    
    if not stat:
        # Generate on fly if missing (fallback)
        ReferralService.update_stats(db, current_user.id)
        stat = db.query(models.ReferralStat).filter(models.ReferralStat.user_id == current_user.id).first()
        if not stat:
             return {"total_directs": 0, "total_team_size": 0, "level_breakdown": {}}

    return stat

@router.get("/link")
def get_referral_link(
    current_user: models.User = Depends(auth.get_current_user)
):
    # Construct link. In production, use env var for domain.
    base_url = "https://domain.com/register"
    return {"link": f"{base_url}?ref={current_user.referral_code}", "code": current_user.referral_code}
