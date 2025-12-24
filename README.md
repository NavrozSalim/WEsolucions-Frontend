# WEsolucions Frontend

React + Vite frontend for WEsolucions Inventory Management System.

## Environment Variables

Create a `.env` file for local development or set these in Vercel:

### Required Variables

- `VITE_API_BASE_URL` - Backend API URL
  - Development: `http://localhost:8000/api`
  - Production: Your backend URL (e.g., `https://your-backend.herokuapp.com/api`)

### Example `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Vercel Deployment

1. **Set Environment Variable in Vercel:**
   - Go to your Vercel project settings
   - Add environment variable: `VITE_API_BASE_URL`
   - Value: Your production backend URL (e.g., `https://your-backend-domain.com/api`)

2. **Backend CORS Configuration:**
   - Make sure your backend allows requests from `https://w-esolucions-frontend.vercel.app`
   - Update `ALLOWED_HOSTS` in backend settings

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
