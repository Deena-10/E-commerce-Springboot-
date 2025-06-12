import React, { createContext, useState, useContext, useEffect, useCallback } from "react"; 
import { fetchCartItems, addCartItem, deleteCartItem } from "../Api/CartApi";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCartItems();
      setCartItems(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product) => {
    if (!product.id) {
      console.error("Invalid product ID", product);
      return;
    }
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      await loadCart();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await deleteCartItem(productId);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  // ✅ Return the Provider here
  return (
    <CartContext.Provider value={{ cartItems, addToCart, loadCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
