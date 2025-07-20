// src/Api/CartApi.js
import axiosInstance from './axiosInstance'; // ✅ includes token in headers

export const fetchCartItems = () => {
  return axiosInstance.get('/api/cart');
};

export const addCartItem = (item) => {
  return axiosInstance.post('/api/cart', item);
};

export const deleteCartItem = (productId) => {
  return axiosInstance.delete(`/api/cart/${productId}`);
};
