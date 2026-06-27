from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    address: Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserWithStatsResponse(UserResponse):
    total_water_usage: float
    usage_count: int

class WaterUsageBase(BaseModel):
    category: str
    amount_liters: float

class WaterUsageCreate(WaterUsageBase):
    pass

class WaterUsageResponse(WaterUsageBase):
    id: int
    user_id: int
    date_recorded: datetime

    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    title: str
    target_liters: float
    deadline: datetime

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    current_liters: float
    is_completed: bool

    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    id: int
    predicted_date: datetime
    predicted_amount: float
    model_version: str

    class Config:
        from_attributes = True

class LeakResponse(BaseModel):
    id: int
    detected_date: datetime
    risk_level: str
    leak_probability: float
    resolved: bool

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    id: int
    title: str
    description: str
    generated_at: datetime

    class Config:
        from_attributes = True
