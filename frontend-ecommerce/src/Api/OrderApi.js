// src/Api/OrderApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/orders';

export const placeOrder = (orderItems) =>
  axios.post(`${BASE_URL}/place`, orderItems);
