import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../img/updatedlogo.jpg';
import { useAuth } from '../Context/AuthContext'; // ✅

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // ✅

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
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
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">🔍</button>
      </form>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/help">Help</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
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
