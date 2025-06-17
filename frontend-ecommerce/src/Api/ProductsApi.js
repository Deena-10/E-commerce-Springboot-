// src/Api/ProductsApi.js
import axiosInstance from './axiosInstance';

export const getproducts = () => axiosInstance.get('/products');

export const updateProductStock = (productId, quantity) =>
  axiosInstance.put(`/products/${productId}/stock`, null, {
    params: { quantity },
  });

export const fetchProductById = (productId) =>
  axiosInstance.get(`/products/${productId}`);
