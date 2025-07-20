import React, { useState } from 'react';
import './ProductCard.css';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { fetchProductById } from '../Api/ProductsApi';
import { getUserRole } from '../utils/getUserRole';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showMessage, setShowMessage] = useState(false);
  const [stock] = useState(product?.stock ?? 0);

  if (!product) {
    return (
      <div className="Card">
        <p>Product not available.</p>
      </div>
    );
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      if (stock > 0) {
        await addToCart(product);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2500);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (stock > 0) {
      const freshProduct = await fetchProductById(product.id);
      navigate('/checkout', { state: { product: freshProduct.data } });
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-product/${product.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      alert(`Deleted product ID: ${product.id}`);
    }
  };

  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <span key={i} style={{ color: i < product.rating ? '#f1c40f' : '#ddd' }}>★</span>
    ));

  return (
    <>
      <Link to={`/product/${product.id}`} className="Card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-wrapper">
          <img
            src={product.img || 'https://via.placeholder.com/300x180?text=No+Image'}
            alt={product.name}
            className="ProductImage"
          />
        </div>

        <h3 className="productname">{product.name}</h3>
        <p className="desc">{product.description}</p>
        <div className="rating">{stars}</div>
        <div className="price">₹{product.price.toLocaleString('en-IN')}</div>

        <div className={`stock ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </div>

        <div className="button-group">
          <button className="addtocart" onClick={handleAddToCart} disabled={stock === 0}>
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button className="buynow" onClick={handleBuyNow} disabled={stock === 0}>
            Buy Now
          </button>
        </div>

        {getUserRole() === 'ADMIN' && (
          <div className="admin-actions">
            <button onClick={handleEdit} className="edit-btn">Edit</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        )}
      </Link>

      {showMessage && (
        <div className="global-toast">Product added to your cart!</div>
      )}
    </>
  );
}

export default ProductCard;
