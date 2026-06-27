from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    is_admin = Column(Boolean, default=False)
    phone_number = Column(String(20), nullable=True)
    company_name = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    water_usages = relationship("WaterUsage", back_populates="user")
    goals = relationship("Goal", back_populates="user")

class WaterUsage(Base):
    __tablename__ = "water_usage"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String(50)) # Kitchen, Bathroom, Laundry, Garden, Cleaning, Drinking, Others
    amount_liters = Column(Float)
    date_recorded = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="water_usages")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    predicted_date = Column(DateTime)
    predicted_amount = Column(Float)
    model_version = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

class LeakHistory(Base):
    __tablename__ = "leak_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    detected_date = Column(DateTime, default=func.now())
    risk_level = Column(String(50)) # High, Medium, Low
    leak_probability = Column(Float)
    resolved = Column(Boolean, default=False)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(100))
    description = Column(String(500))
    generated_at = Column(DateTime, default=func.now())

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(100))
    target_liters = Column(Float)
    current_liters = Column(Float, default=0.0)
    deadline = Column(DateTime)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="goals")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String(50)) # PDF, CSV, Monthly, Yearly
    file_path = Column(String(255))
    generated_at = Column(DateTime, default=func.now())

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String(1000))
    created_at = Column(DateTime, default=func.now())
