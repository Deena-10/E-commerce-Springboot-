// Environment configuration
// All environment variables should be accessed through this file

const config = {
  // Backend API base URL
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  
  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  
  // Helper function to get full API URL
  getApiUrl: (endpoint) => {
    const baseUrl = config.API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
  }
};

// Validate required environment variables in development
if (process.env.NODE_ENV === 'development') {
  if (!config.GOOGLE_CLIENT_ID) {
    console.warn('⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set. Google OAuth may not work.');
  }
}

export default config;

