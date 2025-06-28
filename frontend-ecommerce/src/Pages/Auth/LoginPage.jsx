import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Login.css';
import { useAuth } from '../../Context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, role } = res.data;

      if (accessToken && refreshToken) {
        login(accessToken, role, refreshToken);
        alert('Login successful!');
        navigate('/');
      } else {
        throw new Error('Token not received');
      }

    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert('Invalid credentials. Please try again.');
      } else {
        alert('Login failed: ' + (err.response?.data || 'Server error'));
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <a href="http://localhost:8080/oauth2/authorization/google" className="google-login">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          <span>Continue with Google</span>
        </a>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
