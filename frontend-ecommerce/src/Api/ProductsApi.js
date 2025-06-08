// src/Api/productsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

export const getproducts = () => axios.get(BASE_URL);
