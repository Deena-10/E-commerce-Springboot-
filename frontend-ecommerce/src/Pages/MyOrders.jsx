// src/Pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axiosInstance';
import '../styles/MyOrders.css';
import { useAuth } from '../Context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading } = useAuth(); // ✅ use token

  useEffect(() => {
    if (authLoading || !token) return; // wait until AuthContext is ready

    axiosInstance
      .get('/api/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        alert('Failed to load orders. Please login again.');
      })
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const calculateOrderTotal = (items) =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const calculateGrandTotal = () =>
    orders.reduce((total, order) => total + calculateOrderTotal(order.items), 0);

  if (loading || authLoading) return <p className="loading">Loading your orders...</p>;

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order ID: {order.id}</h3>
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>

              <table className="order-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price (₹)</th>
                    <th>Subtotal (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="order-total">
                Total: ₹{calculateOrderTotal(order.items).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="grand-total-section">
            <h4>Grand Total Spent: ₹{calculateGrandTotal().toFixed(2)}</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
