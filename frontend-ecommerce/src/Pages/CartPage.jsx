import React, { useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cartItems, loadCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleBuyNow = (product) => {
    navigate('/checkout', { state: { product } });
  };

  if (!cartItems || cartItems.length === 0) {
    return <p className="empty-message">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <img
              src={item.img || 'https://via.placeholder.com/80'}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <strong>{item.name}</strong>
              <br />
              <small className="cart-item-description">{item.description}</small>
              <br />
              <span className="cart-item-rating">
                Rating:{' '}
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className={i < item.rating ? 'star-filled' : 'star-empty'}>
                      ★
                    </span>
                  ))}
              </span>
              <br />
              <span className="cart-item-stock">
                Stock: {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
              </span>
              <br />
              <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
              <br />
              <button
                className="remove-btn"
                onClick={() => {
                  if (item.productId) removeFromCart(item.productId);
                  else alert("Product ID missing for this item");
                }}
              >
                Remove
              </button>
              <button className="buy-now-btn" onClick={() => handleBuyNow(item)}>
                Buy Now
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="cart-total">
        Total: ₹
        {cartItems
          .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
          .toFixed(2)}
      </h3>
    </div>
  );
}

export default CartPage;
