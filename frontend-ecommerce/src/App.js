// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import { ErrorBoundary } from './Components/ErrorBoundary';
import ProductCard from './Components/ProductCard'; // used in HomePage
import { getproducts } from './Api/ProductsApi';
import { Routes, Route } from 'react-router-dom';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import Profile from './Pages/Profile';
import LoginPage from './Pages/Auth/LoginPage';
import SignupPage from './Pages/Auth/SignupPage';
import PrivateRoute from './Pages/Auth/PrivateRoute';

// ✅ HomePage renders a list of ProductCard components
function HomePage({ products, loading }) {
  return (
    <div className="container">
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
      )}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getproducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <ErrorBoundary>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ Home Route: Protected and renders list of ProductCards */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage products={products} loading={loading} />
            </PrivateRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
