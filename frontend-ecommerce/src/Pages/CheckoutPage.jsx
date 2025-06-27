import React, { useEffect, useState } from 'react';
import './CheckoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../Api/ProductsApi';
import { placeOrder } from '../Api/OrderApi';
import { deleteCartItem } from '../Api/CartApi';
import axiosInstance from '../Api/axiosInstance';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const rawProduct = location.state?.product;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxStock, setMaxStock] = useState(1);
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

  const handlePayNow = async () => {
    if (!product) return;

    try {
      const latest = await fetchProductById(product.id);
      if (latest.data.stock < quantity) {
        showNotification('❌ Not enough stock available. Please try again.');
        return;
      }

      const amount = product.price * quantity;

      // Step 1: Call backend to create Razorpay order
      const res = await axiosInstance.post('/api/payment/create-order', {
        amount: Math.round(amount),
      });

      const { orderId } = res.data;

      // Step 2: Open Razorpay modal
      const options = {
        key: 'rzp_test_P4kKhexANqaqRH', // Replace with your Razorpay Test Key ID
        amount: amount * 100,
        currency: 'INR',
        name: 'TechTreasure',
        description: `Order for ${product.name}`,
        image: 'https://via.placeholder.com/100x50.png?text=Logo',
        order_id: orderId,
        handler: async function (response) {
          // Step 3: On payment success
          try {
            const orderPayload = [{ productId: product.id, quantity }];
            await placeOrder(orderPayload);
            await deleteCartItem(product.id);

            setIsOrderPlaced(true);
            showNotification('✅ Payment & Order placed successfully!');
            setTimeout(() => navigate('/my-orders'), 1000);
          } catch (err) {
            console.error('Error finalizing order:', err);
            showNotification('❌ Payment succeeded but order failed.');
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'youremail@example.com',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error('Payment failed:', error);
      showNotification('❌ Payment failed. Please try again.');
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
              disabled={isOrderPlaced}
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
        onClick={handlePayNow}
        disabled={isOrderPlaced}
      >
        {isOrderPlaced ? 'Order Placed' : 'Pay Now'}
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
