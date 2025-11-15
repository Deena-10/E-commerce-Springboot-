// src/Api/ProductsApi.js
import axiosInstance from './axiosInstance';

// ✅ Include '/api' in all endpoints
export const getproducts = () => axiosInstance.get('/api/products');

export const updateProductStock = (productId, quantity) =>
  axiosInstance.put(`/api/products/${productId}/stock`, null, {
    params: { quantity },
  });

export const fetchProductById = (productId) =>
  axiosInstance.get(`/api/products/${productId}`);

// ✅ Get products by category
export const getProductsByCategory = (category) =>
  axiosInstance.get(`/api/products/category/${category}`);
