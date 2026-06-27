# Installation & Setup Guide

## Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MySQL Server

## 1. Database Setup
1. Open your MySQL client.
2. Run the `database/schema.sql` script to create the `aquamind` database and tables.

## 2. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it:
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` file from `.env.example` if provided, or edit the existing `.env`. Update `DATABASE_URL` with your MySQL credentials.
6. Generate ML Models (Mock Data):
   - Run `python scripts/train_models.py`
7. Start FastAPI Server:
   - Run `uvicorn app.main:app --reload`
   - API will run at `http://localhost:8000`
   - Swagger UI at `http://localhost:8000/docs`

## 3. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start React dev server: `npm run dev`
4. Access the web app at the URL provided (e.g., `http://localhost:5173`)
