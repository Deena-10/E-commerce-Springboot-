import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Login.css';
import { useAuth } from '../../Context/AuthContext';
import { checkServerStatus } from '../../utils/serverChecker';
import GoogleLoginButton from './GoogleLoginButton';
import config from '../../config/env';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const checkServer = async () => {
      try {
        const result = await checkServerStatus();
        setServerStatus(result.status);

        if (result.status === 'offline') {
          setError(`Backend server is not responding. Please ensure your server is running on ${config.API_BASE_URL}`);
        }
      } catch (err) {
        console.error('Server status check failed:', err);
        setServerStatus('offline');
        setError(`Backend server is not responding. Please ensure your server is running on ${config.API_BASE_URL}`);
      }
    };

    checkServer();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, role, message } = res.data;

      if (message && message.includes('verify')) {
        setError('Please verify your email first. Redirecting to verification page...');
        navigate('/verify', { state: { email } });
        return;
      }

      if (accessToken && refreshToken) {
        login(accessToken, role, refreshToken);
        navigate('/');
      } else {
        setError('Token not received. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error response formats
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Backend returned an error response
        const responseData = err.response.data;
        
        if (typeof responseData === 'string') {
          // Error is a plain string
          errorMessage = responseData;
        } else if (responseData?.message) {
          // Error has a message property
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          // Error has an error property
          errorMessage = responseData.error;
        } else if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (err.response.status === 403) {
          errorMessage = 'Please verify your email first.';
        } else {
          errorMessage = `Login failed: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = `Cannot connect to server. Please ensure your backend is running on ${config.API_BASE_URL}`;
      } else {
        // Error setting up the request
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);

      // Redirect to verification if needed
      if (errorMessage.toLowerCase().includes('verify')) {
        setTimeout(() => {
          navigate('/verify', { state: { email } });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const retryServerCheck = async () => {
    setServerStatus('checking');
    setError('');
    try {
      const result = await checkServerStatus();
      setServerStatus(result.status);
    } catch (err) {
      setServerStatus('offline');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Login to Your Account</h2>

        {serverStatus === 'offline' && (
          <div className="server-offline">
            ⚠️ Backend server is offline
            <button onClick={retryServerCheck}>Retry Connection</button>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || serverStatus === 'offline'}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || serverStatus === 'offline'}
          />
          <button type="submit" disabled={loading || serverStatus === 'offline'}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        {/* Google Login Button */}
        <GoogleLoginButton />

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}export default LoginPage;
