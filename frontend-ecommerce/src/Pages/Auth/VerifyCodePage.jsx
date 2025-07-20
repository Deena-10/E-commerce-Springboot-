import React, { useState } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/VerifyCodePage.css';

function VerifyCodePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axiosInstance.post('/api/auth/verify-code', { email, code });
      setSuccess(res.data.message || 'Verification successful! Redirecting to login...');
      
      // Redirect to login after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.response?.data || err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/auth/resend-code', { email });
      setSuccess('Verification code resent to your email.');
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Verify Your Email</h2>
        {error && <p style={{ color: '#dc2626', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
        {success && <p style={{ color: '#059669', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>{success}</p>}
        <form className="auth-form" onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="6-digit verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <button className="resend-button" onClick={handleResendCode} disabled={loading}>
          Resend Code
        </button>
      </div>
    </div>
  );
}

export default VerifyCodePage;
