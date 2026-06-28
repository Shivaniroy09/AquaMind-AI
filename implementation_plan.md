# Comprehensive Fix for Vercel Deployment

The project currently fails on Vercel with a `500 INTERNAL_SERVER_ERROR` (Function Invocation Failed) for the API routes, and a `404 NOT_FOUND` for the frontend routes.

## Open Questions
None. The root causes have been successfully identified.

## Root Causes

1. **Python Serverless Crash (500 Error):** 
   Vercel's `@vercel/python` builder uses static analysis to determine which files to bundle into the Serverless Function. Because `api/index.py` dynamically injects the `backend/` directory into `sys.path`, Vercel did not detect the dependency and **failed to include the `backend/` directory in the Lambda bundle**. Thus, at runtime, it crashed with a `ModuleNotFoundError` for `app`.

2. **Frontend Build Failure (404 Error):**
   Vercel's `package.json` builder was executing at the project root, but it struggled to correctly run `npm install` inside the `frontend` folder due to `package-lock.json` caching inconsistencies. This caused the Vite build to fail, so `frontend/dist` was never created, leading to a 404 for all frontend routes.

3. **Missing Package Export (500 Error):**
   The Vercel environment relies on `api/index.py` correctly exporting the FastAPI `app`.

## Proposed Changes

### Vercel Configuration (`vercel.json`)
We will completely overhaul the `vercel.json` to properly bundle the frontend and backend without dynamic path workarounds.

#### [MODIFY] vercel.json
- Change the frontend builder to use `frontend/package.json` directly. This natively tells Vercel to change directory to `frontend`, install dependencies correctly, and build to `dist`.
- Keep the `api/index.py` builder but add a `functions` block to explicitly include the `backend/**` files in the Lambda deployment.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "functions": {
    "api/**/*.py": {
      "includeFiles": "backend/**"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend Enhancements

#### [MODIFY] api/index.py
We will ensure `api/index.py` correctly handles the Vercel environment and safely exports the `app` object.

## Verification Plan

### Automated Tests
- N/A (Vercel deployment relies on pushing code and testing the live URL)

### Manual Verification
1. Push the updated configuration to GitHub.
2. Wait for Vercel to rebuild.
3. Verify that `https://aqua-mind-ai.vercel.app/` loads the React frontend (resolving the 404).
4. Verify that `https://aqua-mind-ai.vercel.app/api/auth/login` returns a proper JSON response (resolving the 500).
