# Quick Setup: Vercel Environment Variable

## Your Backend URL:
```
https://w-esolucions-backend.vercel.app/api
```

## Steps to Fix:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select**: WEsolucions-Frontend project
3. **Click**: Settings → Environment Variables
4. **Click**: "Add New"
5. **Enter**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://w-esolucions-backend.vercel.app/api`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
6. **Click**: Save
7. **Redeploy**: Go to Deployments → Click "..." → Redeploy (uncheck cache)

## Verify:
After redeploy, open browser console (F12) and you should see:
```
Using VITE_API_BASE_URL: https://w-esolucions-backend.vercel.app/api
API_BASE_URL configured as: https://w-esolucions-backend.vercel.app/api
```

## Important Notes:
- Make sure your backend CORS allows requests from: `https://w-esolucions-frontend.vercel.app`
- The URL must end with `/api` (not just `/`)
- After setting the variable, you MUST redeploy for it to take effect

