import React, { useState } from 'react';
import axios from 'axios'; // ✅ plain axios without interceptors
import { useNavigate, Link } from 'react-router-dom'; 
import '../../styles/Login.css';
import { useAuth } from '../../Context/AuthContext'; // ✅ Auth Context

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login from context

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
        login(accessToken, role, refreshToken); // ✅ Save tokens and role
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
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
