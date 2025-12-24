# Vercel Environment Variable Setup

## ⚠️ IMPORTANT: Set Environment Variable

Your frontend is deployed but **cannot connect to the backend** because the API URL is not configured.

## Quick Fix Steps:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your **WEsolucions-Frontend** project

### 2. Navigate to Environment Variables
- Click **Settings** → **Environment Variables**

### 3. Add Environment Variable
Click **"Add New"** and enter:
- **Key**: `VITE_API_BASE_URL`
- **Value**: Your backend URL (see examples below)
- **Environments**: Select all (Production, Preview, Development)

### 4. Backend URL Examples:

**If backend is on Vercel:**
```
https://w-esolucions-backend.vercel.app/api
```

**If backend is on VPS:**
```
http://173.212.218.31:8000/api
```
or
```
https://your-domain.com/api
```

**If backend is on Heroku/Railway/Render:**
```
https://your-backend-app.herokuapp.com/api
```

### 5. Redeploy
After adding the variable:
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Make sure **"Use existing Build Cache"** is **UNCHECKED**

### 6. Verify
After redeploy:
1. Open your Vercel frontend URL
2. Open browser console (F12)
3. You should see: `Using VITE_API_BASE_URL: https://your-backend-url/api`
4. Errors should be gone!

## Current Error:
- "Failed to fetch upload history: Unexpected token '<'"
- "Failed to load stores"

These happen because the frontend is trying to call `/api` on the frontend domain instead of your backend.

## Need Help?
Check the browser console (F12) for detailed error messages showing what URL is being called.

