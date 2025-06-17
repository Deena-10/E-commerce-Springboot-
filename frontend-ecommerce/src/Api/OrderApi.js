// src/Api/OrderApi.js
import axiosInstance from './axiosInstance';

export const placeOrder = (orderItems) =>
  axiosInstance.post('/orders/place', orderItems);
