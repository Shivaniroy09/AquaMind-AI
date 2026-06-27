import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
import joblib

def generate_mock_data():
    np.random.seed(42)
    # Generate 100 days of water usage data
    dates = pd.date_range(end=pd.Timestamp.now(), periods=100)
    # Simulate normal usage with some noise (e.g., 100 to 300 liters)
    usage = np.random.normal(200, 50, size=100)
    
    # Introduce anomalies (leaks)
    usage[20] = 800
    usage[55] = 900
    usage[80] = 750
    
    df = pd.DataFrame({'date': dates, 'usage_liters': usage})
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    
    return df

def train_and_save_models():
    df = generate_mock_data()
    
    print("Training Random Forest Regressor for usage prediction...")
    # Features: day_of_week, is_weekend
    X_pred = df[['day_of_week', 'is_weekend']]
    y_pred = df['usage_liters']
    
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_pred, y_pred)
    
    print("Training Isolation Forest for leak detection...")
    # Feature for anomaly detection: usage_liters
    X_anom = df[['usage_liters']]
    if_model = IsolationForest(contamination=0.05, random_state=42)
    if_model.fit(X_anom)
    
    # Create models dir if not exists
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'ml', 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    rf_path = os.path.join(model_dir, 'rf_model.joblib')
    if_path = os.path.join(model_dir, 'if_model.joblib')
    
    joblib.dump(rf_model, rf_path)
    joblib.dump(if_model, if_path)
    
    print(f"Models saved successfully to {model_dir}")

if __name__ == "__main__":
    train_and_save_models()
