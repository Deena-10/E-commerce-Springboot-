import React, { useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import './CartPage.css'; // optional CSS for styling

function CartPage() {
  const { cartItems, loadCart } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-page">
      <h2>Your Cart Items</h2>
      <div className="cart-items-list">
        {cartItems.map(({ productId, name, price, quantity, img }) => (
          <div className="cart-item" key={productId}>
            <img
              src={img || 'https://via.placeholder.com/150?text=No+Image'}
              alt={name}
              className="cart-item-img"
            />
            <div className="cart-item-details">
              <h3>{name}</h3>
              <p>Price: ${price.toFixed(2)}</p>
              <p>Quantity: {quantity}</p>
              <p>Subtotal: ${(price * quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <h3>
        Total: $
        {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
      </h3>
    </div>
  );
}

export default CartPage;
