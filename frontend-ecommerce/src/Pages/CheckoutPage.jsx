import React, { useState } from 'react';
import './CheckoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const handlePlaceOrder = () => {
    alert(`Order placed successfully!\nProduct: ${product.name}\nQuantity: ${quantity}`);
    navigate('/'); // redirect to home or success page
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
