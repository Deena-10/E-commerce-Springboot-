// src/Pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getproducts } from '../Api/ProductsApi';
import ProductCard from '../Components/ProductCard';
import './Home.css'; // Optional: for layout

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getproducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="homepage">
      <h2 className="home-title">Welcome to TechTreasure</h2>

      <div className="product-grid">
        {products.length ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
