// src/Api/ProductsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

// Fetch all products
export const getproducts = () => {
  return axios.get(BASE_URL);
};

export const updateProductStock = (productId, quantity) =>
  axios.put(`${BASE_URL}/${productId}/stock`, null, { params: { quantity } });
