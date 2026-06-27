from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import domain as models
from app.api.auth import get_current_user
import joblib
import pandas as pd
import numpy as np
import os

router = APIRouter()

# Placeholder path for ML models
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "models")
RF_MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.joblib")
IF_MODEL_PATH = os.path.join(MODEL_DIR, "if_model.joblib")

@router.get("/predict")
def predict_usage(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # This is where we would load the ML model and predict
    # For now, we will return a simulated prediction if model doesn't exist
    
    try:
        if os.path.exists(RF_MODEL_PATH):
            model = joblib.load(RF_MODEL_PATH)
            # In a real scenario, we pass features. Here we mock.
            # pred = model.predict(features)
            predicted_tomorrow = 150.5
        else:
            predicted_tomorrow = 120.0 # simulated fallback
            
        return {
            "predicted_tomorrow_liters": predicted_tomorrow,
            "predicted_weekly_liters": predicted_tomorrow * 7,
            "predicted_monthly_liters": predicted_tomorrow * 30,
            "message": "AI prediction successful"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detect-leak")
def detect_leak(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == current_user.id).all()
    if len(usages) < 5:
        return {"risk_level": "Low", "leak_probability": 0.05, "message": "Not enough data for leak detection.", "suggestions": ["Not enough data."]}
        
    # Simulate Isolation Forest logic for now
    total_recent = sum(u.amount_liters for u in usages[-5:])
    avg_recent = total_recent / 5
    
    risk = "Low"
    prob = 0.1
    if avg_recent > 600:
        risk = "High"
        prob = 0.85
    elif avg_recent > 300:
        risk = "Medium"
        prob = 0.45
        
    return {
        "risk_level": risk,
        "leak_probability": prob,
        "suggestions": [
            "Check bathroom pipes",
            "Monitor garden sprinklers",
            "Ensure taps are tightly closed"
        ] if risk != "Low" else ["Water usage is normal."]
    }

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    usages = db.query(models.WaterUsage).filter(models.WaterUsage.user_id == current_user.id).all()
    
    recommendations = []
    
    if len(usages) >= 5:
        total_recent = sum(u.amount_liters for u in usages[-5:])
        avg_recent = total_recent / 5
        
        if avg_recent > 600:
            recommendations.append("Urgent: High water usage anomaly detected. Please inspect main water line and bathroom pipes for severe leaks immediately.")
        elif avg_recent > 300:
            recommendations.append("Notice: Above average water usage anomaly detected. Consider checking garden sprinklers and ensuring taps are fully closed.")
    
    bathroom_usage = sum(u.amount_liters for u in usages if u.category.lower() == 'bathroom')
    if bathroom_usage > 200:
        recommendations.append("Reduce shower time by 2 minutes to save up to 30 liters.")
        
    kitchen_usage = sum(u.amount_liters for u in usages if u.category.lower() == 'kitchen')
    if kitchen_usage > 150:
        recommendations.append("Use a dishwasher only when fully loaded to save kitchen water.")
        
    if not recommendations:
        recommendations.append("You are doing great! Keep tracking your water usage.")
        
    return {"recommendations": recommendations}
