// src/Components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../img/bytenest.png';  // Import the logo image

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to a search results page with the query param
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // For demo, assume user is logged in. You can manage auth state later
  const isLoggedIn = true;

  const handleLogout = () => {
    // Implement your logout logic here (clear tokens, state, etc.)
    alert('Logged out successfully');
    // Redirect to home or login page
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="logo">
        <img src={logo} alt="ByteNest Gadgets Logo" className="logo-img" />
        ByteNest Gadgets
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">🔍</button>
      </form>

      {/* Navigation Links */}
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/help">Help</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
