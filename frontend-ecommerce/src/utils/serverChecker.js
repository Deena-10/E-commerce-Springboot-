// Server status checker utility
export const checkServerStatus = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/health', {
      method: 'GET',
      timeout: 3000,
    });
    
    if (response.ok) {
      return { status: 'online', message: 'Server is running' };
    } else {
      return { status: 'error', message: `Server responded with status: ${response.status}` };
    }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { status: 'offline', message: 'Cannot connect to server. Is it running on http://localhost:8080?' };
    }
    return { status: 'error', message: error.message };
  }
};

export const testEndpoints = async () => {
  const endpoints = [
    '/api/health',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/verify-code'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'GET',
        timeout: 2000,
      });
      results[endpoint] = { status: response.status, ok: response.ok };
    } catch (error) {
      results[endpoint] = { error: error.message };
    }
  }
  
  return results;
}; 