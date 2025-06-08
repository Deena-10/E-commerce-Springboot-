import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/cart';

export const fetchCartItems = () => axios.get(BASE_URL);
export const addCartItem = (item) => axios.post(BASE_URL, item);
