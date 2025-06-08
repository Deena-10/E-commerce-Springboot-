// src/Components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  // optional for styling

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">🛒 TechTreasure</h1>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
};

export default Header;
