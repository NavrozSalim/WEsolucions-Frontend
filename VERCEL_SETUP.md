# Vercel Setup Instructions - URGENT

## Current Issue
Your frontend on Vercel is trying to call `/api` which points to `w-esolucions-frontend.vercel.app/api` - but your backend is NOT on Vercel!

## Solution: Set Environment Variable in Vercel

### Step 1: Get Your Backend URL
You need to know where your backend is deployed:
- **VPS**: `http://your-vps-ip:8000/api` or `https://your-domain.com/api`
- **Heroku**: `https://your-app.herokuapp.com/api`
- **Railway**: `https://your-app.railway.app/api`
- **Render**: `https://your-app.onrender.com/api`
- **Not deployed yet?** You need to deploy it first!

### Step 2: Set Environment Variable in Vercel

1. Go to: https://vercel.com/your-account/w-esolucions-frontend/settings/environment-variables

2. Click **"Add New"**

3. Add this variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.com/api`)
   - **Environment**: Select **Production**, **Preview**, and **Development**

4. Click **"Save"**

### Step 3: Redeploy

After setting the variable:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Make sure **"Use existing Build Cache"** is **UNCHECKED**
5. Click **"Redeploy"**

### Step 4: Verify

1. Open your Vercel site: https://w-esolucions-frontend.vercel.app
2. Open browser console (F12)
3. Check the console logs - you should see:
   ```
   Using VITE_API_BASE_URL: https://your-backend.com/api
   API_BASE_URL configured as: https://your-backend.com/api
   ```
4. If you see errors, check the Network tab to see what URL is being called

## If Backend is NOT Deployed Yet

You have two options:

### Option 1: Deploy Backend to VPS (Recommended)
1. Use the `deploy.sh` script on your VPS
2. Get your VPS IP or domain
3. Set `VITE_API_BASE_URL` to `http://your-vps-ip:8000/api` or `https://your-domain.com/api`

### Option 2: Deploy Backend to Cloud Platform
- **Heroku**: Free tier available, easy Django deployment
- **Railway**: Simple deployment
- **Render**: Free tier available

## Quick Test

After setting the environment variable, test in browser console:
```javascript
fetch('YOUR_BACKEND_URL/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "healthy", api: "operational"}`

## Common Mistakes

❌ **Wrong**: `VITE_API_BASE_URL=https://your-backend.com` (missing `/api`)
✅ **Correct**: `VITE_API_BASE_URL=https://your-backend.com/api`

❌ **Wrong**: `VITE_API_BASE_URL=http://localhost:8000/api` (won't work on Vercel)
✅ **Correct**: `VITE_API_BASE_URL=https://your-deployed-backend.com/api`

## Need Help?

1. Check browser console (F12) for error messages
2. Check Network tab to see what URLs are being called
3. Verify backend is accessible: `curl https://your-backend.com/api/health`

