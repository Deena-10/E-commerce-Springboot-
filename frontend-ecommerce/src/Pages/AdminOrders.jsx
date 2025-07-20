import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axiosInstance'; // Use your configured axiosInstance
import '../styles/MyOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/orders/all')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch admin orders:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="my-orders-container">
      <h2>All Orders (Admin View)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>

            {/* User info */}
            <p><strong>Name:</strong> {order.userName}</p>
            <p><strong>Email:</strong> {order.userEmail}</p>
            <p><strong>Phone:</strong> {order.userPhone || 'N/A'}</p>
            <p><strong>Address:</strong> {order.userAddress || 'N/A'}</p>

            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
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
              Total: ₹{order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
