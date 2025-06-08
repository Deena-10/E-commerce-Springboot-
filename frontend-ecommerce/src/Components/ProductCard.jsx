import React, { useState } from 'react';
import './ProductCard.css'; // Make sure your CSS file is imported
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

function ProductCard({ product }) {
  const { name, description, img, rating, price, stock } = product;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product);

      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);  // match animation length
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} style={{ color: i < rating ? '#f1c40f' : '#ddd' }}>★</span>
  ));

  return (
    <div className="Card">
      <img
        src={img || 'https://via.placeholder.com/300x180?text=No+Image'}
        alt={name}
        className="ProductImage"
      />
      <h3 className="productname">{name}</h3>
      <p className="desc">{description}</p>
      <div className="rating">{stars}</div>
      <div className="price">${price.toFixed(2)}</div>
      <div className="stock">{stock > 0 ? `${stock} in stock` : 'Out of stock'}</div>

      <div className="button-group">
        <button
          className="addtocart"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        <button
          className="buynow"
          onClick={() => navigate('/checkout')}
          disabled={stock === 0}
        >
          Buy Now
        </button>
      </div>

      {showMessage && (
        <div className="toast-message">
          Product added to your shopping cart
        </div>
      )}
    </div>
  );
}

export default ProductCard;
