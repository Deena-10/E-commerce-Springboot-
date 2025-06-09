// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import './CheckoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProductStock } from '../Api/ProductsApi';
import { placeOrder } from '../Api/OrderApi';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="checkout-container">
        <p>No product selected for checkout.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handlePlaceOrder = async () => {
    try {
      // 1. Place the order
      const orderItem = {
        productId: product.id,
        quantity,
        price: product.price,
        productName: product.name,
      };
      await placeOrder([orderItem]);

      // 2. Calculate new stock and update product stock
      const newStock = product.stock - quantity;
      await updateProductStock(product.id, newStock);

      alert(`Order placed successfully!\nProduct: ${product.name}\nQuantity: ${quantity}`);
      navigate('/');
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-product">
        <img src={product.img} alt={product.name} className="checkout-product-img" />
        <div className="checkout-product-details">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <label>
            <strong>Quantity: </strong>
            <select value={quantity} onChange={handleQuantityChange}>
              {Array.from({ length: product.stock }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <h3>Total: ${totalPrice}</h3>

      <button onClick={handlePlaceOrder} className="place-order-btn">
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;
