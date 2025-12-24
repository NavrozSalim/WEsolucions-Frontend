# Vercel Deployment Fix Guide

## Issues Fixed

1. ✅ **API URL Configuration** - Updated to use environment variables
2. ✅ **CORS Settings** - Added Vercel domain to backend CORS
3. ✅ **Environment Detection** - Frontend now detects dev vs production

## Steps to Fix Vercel Deployment

### 1. Set Environment Variable in Vercel

1. Go to your Vercel project: https://vercel.com/your-account/w-esolucions-frontend
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend-domain.com/api`)
   - **Environment**: Production, Preview, Development (select all)

### 2. Update Backend CORS (If Backend is Deployed)

If your backend is deployed, update the environment variables:

1. Add `VERCEL_FRONTEND_URL=https://w-esolucions-frontend.vercel.app`
2. Or update `ALLOWED_HOSTS` to include your backend domain
3. Make sure `CORS_ALLOWED_ORIGINS` includes the Vercel URL

### 3. Redeploy Frontend

After setting the environment variable:
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger redeploy

### 4. Verify Backend is Accessible

Test your backend API:
```bash
curl https://your-backend-domain.com/api/health
```

Should return: `{"status": "healthy", "api": "operational"}`

## Common Issues

### Issue: "Failed to fetch"
**Solution**: 
- Check `VITE_API_BASE_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check browser console for CORS errors

### Issue: CORS Error
**Solution**:
- Add Vercel URL to backend `CORS_ALLOWED_ORIGINS`
- Check backend `ALLOWED_HOSTS` includes backend domain
- Verify backend is not blocking requests

### Issue: 404 Not Found
**Solution**:
- Verify backend API endpoints exist
- Check API URL is correct (should end with `/api`)
- Test backend endpoints directly

## Backend Deployment (If Not Deployed)

If your backend is not deployed yet, you have options:

1. **Deploy to VPS** (Recommended)
   - Use the `deploy.sh` script
   - Update `VITE_API_BASE_URL` to your VPS IP/domain

2. **Deploy to Heroku/Railway/Render**
   - Follow their Django deployment guides
   - Update `VITE_API_BASE_URL` to your deployment URL

3. **Use Vercel Serverless Functions** (Not recommended for Django)
   - Requires significant refactoring

## Testing

After deployment:
1. Visit: https://w-esolucions-frontend.vercel.app
2. Open browser console (F12)
3. Check for any errors
4. Test API calls in Network tab

## Current Configuration

- **Frontend URL**: https://w-esolucions-frontend.vercel.app
- **Backend URL**: (Set in `VITE_API_BASE_URL`)
- **API Endpoint**: `/api/` (relative) or full URL (if backend on different domain)

