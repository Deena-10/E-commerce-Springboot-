// src/Api/CartApi.js
import axiosInstance from './axiosInstance';

export const fetchCartItems = () => axiosInstance.get('/cart');
export const addCartItem = (item) => axiosInstance.post('/cart', item);
export const deleteCartItem = (productId) => axiosInstance.delete(`/cart/${productId}`);
