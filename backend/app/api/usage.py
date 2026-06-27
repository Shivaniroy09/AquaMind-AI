from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models import domain as models
from app.schemas import all as schemas
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.WaterUsageResponse)
def add_usage(usage: schemas.WaterUsageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_usage = models.WaterUsage(**usage.model_dump(), user_id=current_user.id)
    db.add(new_usage)
    db.commit()
    db.refresh(new_usage)
    return new_usage

@router.get("/", response_model=List[schemas.WaterUsageResponse])
def get_usage(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == current_user.id).order_by(models.WaterUsage.date_recorded.desc()).all()
    return usages

@router.delete("/{usage_id}")
def delete_usage(usage_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    usage = db.query(models.WaterUsage).filter(models.WaterUsage.id == usage_id, models.WaterUsage.user_id == current_user.id).first()
    if not usage:
        raise HTTPException(status_code=404, detail="Usage record not found")
    db.delete(usage)
    db.commit()
    return {"message": "Usage deleted successfully"}

@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    today = datetime.now().date()
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == current_user.id).all()
    
    today_total = sum(u.amount_liters for u in usages if u.date_recorded.date() == today)
    
    start_of_week = today - timedelta(days=today.weekday())
    weekly_total = sum(u.amount_liters for u in usages if u.date_recorded.date() >= start_of_week)
    
    start_of_month = today.replace(day=1)
    monthly_total = sum(u.amount_liters for u in usages if u.date_recorded.date() >= start_of_month)
    
    return {
        "today_usage": today_total,
        "weekly_usage": weekly_total,
        "monthly_usage": monthly_total,
    }
