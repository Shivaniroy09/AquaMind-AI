import sys
import os
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.domain import User
from app.core.security import verify_password, get_password_hash

db = SessionLocal()

user = db.query(User).filter(User.username == "admin").first()
if user:
    print("User found:", user.username)
    print("Hashed password:", user.hashed_password)
    valid = verify_password("Coldcoffee@09", user.hashed_password)
    print("Valid with Coldcoffee@09:", valid)
    
    # Just in case, re-hash and update it to be absolutely sure
    user.hashed_password = get_password_hash("Coldcoffee@09")
    db.commit()
    print("Re-hashed password and saved just to be sure.")
else:
    print("User admin not found")

db.close()
