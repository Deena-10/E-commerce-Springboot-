// src/Pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../Components/ProductCard';
import { getproducts } from '../Api/ProductsApi';
import '../styles/ProductCard.css'; // Optional if you want shared styles

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getproducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading products...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div className="product-container">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>No products available.</p>
      )}
    </div>
  );
}

export default Home;
