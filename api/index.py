import sys
import os

# Hardcode the DATABASE_URL to avoid crashes on Vercel
os.environ["DATABASE_URL"] = "sqlite:////tmp/aquamind.db"

# Add the backend directory to sys.path so 'app' can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app
