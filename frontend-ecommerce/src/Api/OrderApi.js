// src/Api/OrderApi.js
import axiosInstance from './axiosInstance';

export const placeOrder = (orderItems) =>
  axiosInstance.post('/api/orders/place', orderItems);
