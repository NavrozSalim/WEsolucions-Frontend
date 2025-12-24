// Detect environment
const IS_DEV = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get API URL from environment variable or use defaults
const getApiBaseUrl = () => {
  // Check for explicit API URL in environment (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL;
    console.log('Using VITE_API_BASE_URL:', url);
    return url;
  }
  
  // In development, use localhost
  if (IS_DEV) {
    const url = "http://localhost:8000/api";
    console.log('Using development API URL:', url);
    return url;
  }
  
  // In production without VITE_API_BASE_URL, show error
  console.error('VITE_API_BASE_URL is not set! Please set it in Vercel environment variables.');
  console.error('Current hostname:', window.location.hostname);
  
  // Fallback: Try to use relative path (won't work if backend is on different domain)
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('API_BASE_URL configured as:', API_BASE_URL);

