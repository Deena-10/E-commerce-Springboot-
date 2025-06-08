import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { getproducts } from '../Api/ProductApi';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getproducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Product fetch failed:', err);
        setLoading(false);
      });
  }, []);

  const goToProfile = () => navigate('/profile');

  return (
    <div className="home-page">
      <div className="home-header">
        <h1> 🛍️ Discover the Best at <span className="brand-name">TechTreasure</span></h1>
        <button onClick={goToProfile} className="profile-btn">👤 My Profile</button>
      </div>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products-text">No products available at the moment.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;