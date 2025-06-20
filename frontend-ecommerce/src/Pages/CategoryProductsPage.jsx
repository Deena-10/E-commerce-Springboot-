import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../Api/ProductsApi';
import ProductCard from '../Components/ProductCard';

const CategoryProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsByCategory(category)
      .then((res) => {
        setProducts(res.data); // Already filtered from backend ✅
      })
      .catch((err) => {
        console.error('Error fetching category products:', err);
      });
  }, [category]);

  return (
    <div className="category-products-page">
      <h2>{category} Products</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
