// Detect environment
const IS_DEV = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get API URL from environment variable or use defaults
const getApiBaseUrl = () => {
  // Check for explicit API URL in environment
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use localhost
  if (IS_DEV) {
    return "http://localhost:8000/api";
  }
  
  // In production, use relative path (same domain) or configure your backend URL
  // If backend is on a different domain, set VITE_API_BASE_URL in Vercel
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

