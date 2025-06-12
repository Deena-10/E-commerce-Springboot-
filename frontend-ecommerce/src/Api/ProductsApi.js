// src/Api/ProductsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

export const getproducts = () => axios.get(BASE_URL);

export const updateProductStock = (productId, quantity) =>
  axios.put(`${BASE_URL}/${productId}/stock`, null, {
    params: { quantity },
  });

export const fetchProductById = (productId) =>
  axios.get(`${BASE_URL}/${productId}`);
