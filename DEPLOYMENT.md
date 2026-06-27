# Backend Deployment Guide

## Deploy to Railway

Railway is the easiest way to deploy your FastAPI backend with a free tier ($5/month credit).

### Steps:

1. **Go to [railway.app](https://railway.app)** and sign up with your GitHub account

2. **Click "New Project" → "Deploy from GitHub Repo"**
   - Select `Shivaniroy09/AquaMind-AI` repository
   - Authorize Railway to access your GitHub

3. **Configure the Deployment:**
   - Root Directory: `.` (Railway will find Dockerfile automatically)
   - Railway will auto-detect the Dockerfile and deploy

4. **Get Your API URL:**
   - After deployment, Railway will show your live URL
   - It will be something like: `https://aquamind-api-production.railway.app`
   - Copy this URL

5. **Update Environment Variables:**
   - In your GitHub repository, go to **Settings → Secrets and variables → Actions**
   - Add secret: `API_URL` = `https://your-railway-url/api`
   - This will automatically rebuild and redeploy your frontend with the correct API endpoint

6. **Verify It's Working:**
   - Go to your Railway dashboard
   - Check the logs to ensure the backend is running
   - Test the API: `curl https://your-railway-url/`

### Environment Variables (if needed):

Railway automatically reads `Dockerfile` and will expose the app on the `$PORT` environment variable.

If you need a database, you can add it through Railway's dashboard:
- Click "+ Add" in your project
- Select PostgreSQL or MySQL
- It will automatically add the connection string as an environment variable

### Troubleshooting:

- **Port Error**: The Dockerfile uses `$PORT` environment variable (Railway provides this)
- **Python Version**: Using Python 3.11-slim for smaller image size
- **Dependencies**: All are in `backend/requirements.txt`

### Next Steps:

Once your backend is deployed:
1. Get the URL from Railway
2. Set `API_URL` secret in GitHub
3. Frontend will automatically redeploy with the correct API endpoint
4. Users can now register and sign in!

---

**Need Help?** Check Railway docs at [railway.app/docs](https://railway.app/docs)
