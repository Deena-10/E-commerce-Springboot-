// src/Pages/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import './CheckoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../Api/ProductsApi';
import { placeOrder } from '../Api/OrderApi';
import { deleteCartItem } from '../Api/CartApi';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const rawProduct = location.state?.product;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxStock, setMaxStock] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [notification, setNotification] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    const normalizeAndFetchStock = async () => {
      if (!rawProduct) return;

      const id = rawProduct.productId || rawProduct.id;
      const name = rawProduct.productName || rawProduct.name;

      try {
        const response = await fetchProductById(id);
        const stock = response.data.stock;

        setMaxStock(stock);
        setQuantity(rawProduct.quantity || 1);

        setProduct({
          id,
          name,
          description: rawProduct.description || '',
          price: rawProduct.price,
          img: rawProduct.img || '',
        });
      } catch (error) {
        console.error('Error fetching stock:', error);
        showNotification('❌ Error loading product stock.');
      }
    };

    normalizeAndFetchStock();
  }, [rawProduct]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handlePlaceOrder = async () => {
    if (!product) return;

    setIsPlacingOrder(true);

    try {
      const latest = await fetchProductById(product.id);
      if (latest.data.stock < quantity) {
        showNotification('❌ Not enough stock available. Please try again.');
        setIsPlacingOrder(false);
        return;
      }

      const orderPayload = [{ productId: product.id, quantity }];

      await placeOrder(orderPayload);
      await deleteCartItem(product.id);

      setIsOrderPlaced(true);
      showNotification('✅ Order placed successfully!');

      // Navigate to order history page
      setTimeout(() => navigate('/my-orders'), 100);
    } catch (error) {
      console.error('Order failed:', error);
      showNotification('❌ Order failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-card">
        <img
          src={product.img || 'https://via.placeholder.com/120'}
          alt={product.name}
          className="checkout-image"
        />
        <div className="checkout-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
          <p>
            <strong>Quantity:</strong>{' '}
            <select
              className="quantity-select"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              disabled={isPlacingOrder || isOrderPlaced}
            >
              {[...Array(maxStock).keys()].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>{' '}
            <span style={{ fontSize: '0.9em' }}>(In stock: {maxStock})</span>
          </p>
          <p><strong>Total:</strong> ₹{(product.price * quantity).toFixed(2)}</p>
        </div>
      </div>

      <button
        className={`place-order-btn ${isOrderPlaced ? 'order-success-btn' : ''}`}
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder || isOrderPlaced}
      >
        {isOrderPlaced
          ? 'Order Placed'
          : isPlacingOrder
          ? 'Placing Order...'
          : 'Place Order'}
      </button>

      {notification && (
        <div className="toast-notification">
          {notification}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
