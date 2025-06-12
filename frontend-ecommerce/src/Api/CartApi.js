import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/cart';

export const fetchCartItems = () => axios.get(BASE_URL);
export const addCartItem = (item) => axios.post(BASE_URL, item);

// ✅ Add this line for deleting a cart item by productId
export const deleteCartItem = (productId) => axios.delete(`${BASE_URL}/${productId}`);
