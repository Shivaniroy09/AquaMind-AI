from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.models import domain as models
from app.schemas import all as schemas
from app.api.auth import get_current_admin_user

router = APIRouter()

@router.get("/users", response_model=List[schemas.UserWithStatsResponse])
def get_all_users(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    users = db.query(models.User).all()
    result = []
    for user in users:
        # Calculate stats
        usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == user.id).all()
        total_usage = sum(u.amount_liters for u in usages)
        usage_count = len(usages)
        
        user_dict = user.__dict__.copy()
        user_dict['total_water_usage'] = total_usage
        user_dict['usage_count'] = usage_count
        result.append(user_dict)
        
    return result

@router.get("/users/{user_id}/activity", response_model=List[schemas.WaterUsageResponse])
def get_user_activity(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == user_id).order_by(models.WaterUsage.date_recorded.desc()).all()
    return usages

@router.get("/users/{user_id}/recommendations")
def get_admin_user_recommendations(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == user_id).all()
    
    recommendations = []
    
    if len(usages) >= 5:
        total_recent = sum(u.amount_liters for u in usages[-5:])
        avg_recent = total_recent / 5
        if avg_recent > 600:
            recommendations.append(f"URGENT: {user.username} has highly anomalous recent usage (avg {avg_recent:.1f}L). Suggest they immediately inspect main lines for severe leaks.")
        elif avg_recent > 300:
            recommendations.append(f"Notice: {user.username} has above-average recent usage (avg {avg_recent:.1f}L). Suggest they check garden sprinklers or large appliances.")
            
    # Category based
    categories = {}
    for u in usages:
        cat = u.category.lower()
        categories[cat] = categories.get(cat, 0) + u.amount_liters
        
    if categories.get('bathroom', 0) > 200:
        recommendations.append(f"High Bathroom Usage: Suggest {user.username} to install low-flow showerheads and check toilets for silent leaks.")
    if categories.get('kitchen', 0) > 150:
        recommendations.append(f"High Kitchen Usage: Suggest {user.username} to only run the dishwasher when fully loaded and fix dripping taps.")
    if categories.get('garden', 0) > 400:
        recommendations.append(f"High Garden Usage: Advise {user.username} to water plants during early morning or evening to reduce evaporation.")
    if categories.get('drinking', 0) > 100:
        recommendations.append(f"Anomalous Drinking Usage: {user.username} logged >100L for drinking. This may be a logging error or indicative of a commercial setting.")
    if categories.get('others', 0) > 300:
        recommendations.append(f"High 'Others' Usage: Ask {user.username} to correctly categorize their water usage to receive better AI insights.")
        
    if not recommendations:
        recommendations.append(f"{user.username}'s water usage appears normal. No immediate action required.")
        
    return {"recommendations": recommendations}
