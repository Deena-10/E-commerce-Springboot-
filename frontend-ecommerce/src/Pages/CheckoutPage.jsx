import React from 'react';
import './CheckoutPage.css';

import { useCart } from '../Context/CartContext';
import './CheckoutPage.css';  // Optional CSS

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    clearCart();
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty. Please add items before checkout.</p>;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <ul className="checkout-list">
        {cartItems.map((item, index) => (
          <li key={index} className="checkout-item">
            <span>{item.name}</span> - <span>Quantity: {item.quantity}</span> -{' '}
            <span>Price: ${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h3>Total: ${totalPrice.toFixed(2)}</h3>

      <button onClick={handlePlaceOrder} className="place-order-btn">
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;
