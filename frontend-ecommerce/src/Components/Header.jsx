import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../img/updatedlogo.jpg';
import { useAuth } from '../Context/AuthContext';
import axios from '../Api/axiosInstance';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`/products/search-suggestions?query=${encodeURIComponent(searchTerm)}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (text) => {
    setSearchTerm(text);
    navigate(`/search?query=${encodeURIComponent(text)}`);
    setSuggestions([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="logo">
        <img src={logo} alt="ByteNest Gadgets Logo" className="logo-img" />
        ByteNest Gadgets
      </h1>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => handleSuggestionClick(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button">🔍</button>
      </form>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/MyOrders">My Orders</Link>
        <Link to="/cart">Cart</Link>
        {user?.role === 'ADMIN' && <Link to="/admin/orders">Admin Dashboard</Link>}
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/help">Help</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
