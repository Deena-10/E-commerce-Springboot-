import React, { useState } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/SignupPage.css';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      setError('Signup successful! Redirecting to verification page...');
      navigate('/verify', { state: { email } });
    } catch (err) {
      setError(err.response?.data || err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Create Your Account</h2>
        {error && <p style={{ color: error.includes('successful') ? '#059669' : '#dc2626', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            required
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '500' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
