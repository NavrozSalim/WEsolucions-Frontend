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
  const errorMsg = 'VITE_API_BASE_URL is not set! Please set it in Vercel environment variables.';
  console.error(errorMsg);
  console.error('Current hostname:', window.location.hostname);
  console.error('To fix: Go to Vercel → Settings → Environment Variables → Add VITE_API_BASE_URL');
  
  // Don't use relative path - it will fail. Show error to user instead.
  // Return empty string to force errors that are easier to debug
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('API_BASE_URL configured as:', API_BASE_URL);

