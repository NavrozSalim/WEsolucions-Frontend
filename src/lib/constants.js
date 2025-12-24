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
  
  // Use relative path as fallback (will show clear error when it fails)
  // This allows the app to load, but API calls will show helpful errors
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('=== API CONFIGURATION DEBUG ===');
console.log('API_BASE_URL configured as:', API_BASE_URL);
console.log('VITE_API_BASE_URL env var:', import.meta.env.VITE_API_BASE_URL);
console.log('Is DEV:', IS_DEV);
if (typeof window !== 'undefined') {
  console.log('Hostname:', window.location.hostname);
  console.log('Full URL:', window.location.href);
}
console.log('All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
console.log('==============================');

// Test backend connection on load (if in browser)
if (typeof window !== 'undefined' && API_BASE_URL && API_BASE_URL !== '/api') {
  const healthUrl = `${API_BASE_URL.replace(/\/$/, '')}/health`.replace(/\/\/health/, '/health');
  console.log('Testing backend health at:', healthUrl);
  fetch(healthUrl)
    .then(res => {
      console.log('Health check response status:', res.status);
      return res.json();
    })
    .then(data => console.log('✅ Backend health check SUCCESS:', data))
    .catch(err => console.error('❌ Backend health check FAILED:', err));
}

