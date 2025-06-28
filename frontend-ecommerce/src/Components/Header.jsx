import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`/products/search-suggestions?query=${encodeURIComponent(searchTerm)}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    }, 300);

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
    navigate(`/search?query=${encodeURIComponent(text)}`);
    setSuggestions([]);
    setSearchTerm(text);
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

      <form onSubmit={handleSearch} className="search-form alt" autoComplete="off">
        <input
          type="text"
          placeholder="Search for gadgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input alt"
        />
        <button type="submit" className="search-button alt">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
              6.5 6.5 0 109.5 16c1.61 0 3.09-.59 
              4.23-1.57l.27.28v.79l5 5L20.49 
              19l-5-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
        </button>

        {Array.isArray(suggestions) && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </form>

      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Categories
        </NavLink>
        <NavLink to="/MyOrders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          My Orders
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Cart
        </NavLink>

        {user?.role === 'ADMIN' && (
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Admin Dashboard
          </NavLink>
        )}

        {!isAuthenticated ? (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Login
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/help" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Help
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Profile
            </NavLink>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
