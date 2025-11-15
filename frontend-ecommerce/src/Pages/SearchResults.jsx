// src/Pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../Api/axiosInstance'; // ✅ use your token-aware instance
import ProductCard from '../Components/ProductCard';
import './SearchResults.css';

const SearchResults = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('query') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // ✅ Don't use full URL — rely on baseURL
        const res = await axios.get(`/api/products`); // gets all products
        const allProducts = res.data || [];

        const filtered = allProducts.filter(p =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error('❌ Failed to load search results', err);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="search-results-container">
      <h2>Search Results for: "{query}"</h2>
      {results.length > 0 ? (
        <div className="product-list">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="no-results">No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
