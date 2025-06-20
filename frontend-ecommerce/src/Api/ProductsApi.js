// src/Api/ProductsApi.js
import axiosInstance from './axiosInstance';

export const getproducts = () => axiosInstance.get('/products');

export const updateProductStock = (productId, quantity) =>
  axiosInstance.put(`/products/${productId}/stock`, null, {
    params: { quantity },
  });

export const fetchProductById = (productId) =>
  axiosInstance.get(`/products/${productId}`);

// ✅ NEW: Get products by category
export const getProductsByCategory = (category) =>
  axiosInstance.get(`/products/category/${category}`);
