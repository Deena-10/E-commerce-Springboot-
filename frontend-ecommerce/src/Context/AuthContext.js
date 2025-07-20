// src/Context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode }  from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          setToken(storedToken); 
          setIsAuthenticated(true);
          setUser({ email: decoded.sub, role: decoded.role });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (accessToken, role, refreshToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    try {
      const decoded = jwtDecode(accessToken);
      setToken(accessToken); 
      setIsAuthenticated(true);
      setUser({ email: decoded.sub, role: decoded.role });
    } catch (err) {
      console.error("Failed to decode token during login", err);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null); 
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
