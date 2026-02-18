from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, literal, func
from models import User, ReferralStat
from typing import List, Dict, Any

class ReferralService:
    @staticmethod
    def get_referral_tree(db: Session, root_user_id: int, max_depth: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch the downline tree using a recursive CTE.
        Returns a flat list of nodes with 'level' attribute.
        """
        # Base case: direct referrals
        stmt = select(
            User.id, 
            User.username, 
            User.email, 
            User.referral_code, 
            User.referred_by_id, 
            User.created_by,
            User.is_active,
            literal(1).label('level')
        )
        
        if root_user_id is None:
            stmt = stmt.where(User.referred_by_id.is_(None))
        else:
            stmt = stmt.where(User.referred_by_id == root_user_id)
            
        cte = stmt.cte(name="downline", recursive=True)

        parent = aliased(User)
        child = cte

        # Recursive step: find referrals of referrals
        cte = cte.union_all(
            select(
                parent.id, 
                parent.username, 
                parent.email, 
                parent.referral_code, 
                parent.referred_by_id, 
                parent.created_by,
                parent.is_active,
                child.c.level + 1
            ).where(parent.referred_by_id == child.c.id)
             .where(child.c.level < max_depth)
        )

        result = db.execute(select(cte).order_by(cte.c.level)).mappings().all()
        
        # Convert to list of dicts
        return [dict(row) for row in result]

    @staticmethod
    def update_stats(db: Session, user_id: int):
        """
        Recalculate and update stats for a specific user.
        This is expensive and should be backgrounded in production.
        """
        tree = ReferralService.get_referral_tree(db, user_id, max_depth=20)
        
        total_directs = sum(1 for node in tree if node['level'] == 1)
        total_team = len(tree)
        level_counts = {}
        for node in tree:
            lvl = str(node['level'])
            level_counts[lvl] = level_counts.get(lvl, 0) + 1
            
        stat = db.query(ReferralStat).filter(ReferralStat.user_id == user_id).first()
        if not stat:
            stat = ReferralStat(user_id=user_id)
            db.add(stat)
            
        stat.total_directs = total_directs
        stat.total_team_size = total_team
        stat.level_breakdown = level_counts
        
        db.commit()

    @staticmethod
    def propagate_stats_update(db: Session, new_user_id: int):
        """
        When a new user is added, update stats for all 20 uplines.
        """
        current_id = new_user_id
        # We need to traverse UP the chain
        # Ideally, we do this iteratively
        user = db.query(User).filter(User.id == current_id).first()
        
        if not user or not user.referred_by_id:
            return

        uplines = []
        curr = user
        for _ in range(20):
            if not curr.referred_by_id:
                break
            # Fetch parent
            parent = db.query(User).filter(User.id == curr.referred_by_id).first()
            if parent:
                uplines.append(parent.id)
                curr = parent
            else:
                break
        
        # Update stats for all found uplines
        for uid in uplines:
            ReferralService.update_stats(db, uid)
