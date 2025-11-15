import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      try {
        // Safely decode JWT token
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }
        
        const decoded = JSON.parse(atob(parts[1]));
        const role = decoded.role || "USER";
        login(token, role, null); // pass null for refreshToken
        navigate('/');
      } catch (err) {
        console.error("Failed to decode JWT", err);
        alert('OAuth authentication failed. Please try logging in again.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [login, navigate]);

  return <p>Redirecting...</p>;
}

export default OAuthCallback;
