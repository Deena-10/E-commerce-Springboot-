import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    return isExpired ? null : decoded;
  } catch {
    return null;
  }
};

const PrivateRoute = ({ children, requiredRole }) => {
  const payload = getTokenPayload();

  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && payload.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
