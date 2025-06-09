// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import { ErrorBoundary } from './Components/ErrorBoundary';
import ProductCard from './Components/ProductCard';
import { getproducts } from './Api/ProductsApi';  // ensure this function is exported correctly
import { Routes, Route } from 'react-router-dom';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import Profile from './Pages/Profile';

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
      {/* Add Header here to show on every page */}
      <Header />
      
      <Routes>
        <Route path="/profile" element={<Profile />} />

        <Route path="/" element={<HomePage products={products} loading={loading} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
