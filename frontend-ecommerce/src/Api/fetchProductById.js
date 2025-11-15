// src/Api/FetchProductById.js
import axiosInstance from './axiosInstance';

export const fetchProductById = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}`);
  return response.data;
};
