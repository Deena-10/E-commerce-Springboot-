import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Header from './Components/Header';
import { ErrorBoundary } from './Components/ErrorBoundary';
import ProductCard from './Components/ProductCard';
import { getproducts } from './Api/ProductsApi';
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import Profile from './Pages/ProfilePage';
import LoginPage from './Pages/Auth/LoginPage';
import SignupPage from './Pages/Auth/SignupPage';
import PrivateRoute from './Pages/Auth/PrivateRoute';
import MyOrders from './Pages/MyOrders';
import CategoryPage from './Pages/CategoryPage';
import CategoryProductsPage from './Pages/CategoryProductsPage';
import AdminOrders from './Pages/AdminOrders';
import HelpPage from './Pages/HelpPage';
import SearchResults from './Pages/SearchResults';
import VerifyCodePage from './Pages/Auth/VerifyCodePage'; 

import OAuthCallback from './Components/OAuthCallback';

function HomePage({ products, loading }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div className="product-grid page-transition">
      {products.map((product, index) => (
        <ProductCard key={product.id || index} product={product} />
      ))}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  // Hide header on these public pages
  const hideHeaderPaths = ['/login', '/signup', '/verify'];

  return (
    <ErrorBoundary>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryProductsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage products={products} loading={loading} />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route path="/MyOrders" element={<Navigate to="/my-orders" replace />} />
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
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoryPage />
            </PrivateRoute>
          }
        />

        {/* Admin-only Route */}
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminOrders />
            </PrivateRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
