import React, { createContext, useState, useContext, useEffect, useCallback } from "react"; 
import { fetchCartItems, addCartItem, deleteCartItem } from "../Api/CartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    
    try {
      const res = await fetchCartItems();
      setCartItems(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]); // fallback to empty array
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [loadCart, authLoading]);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      console.error("User must be logged in to add items to cart");
      return;
    }
    
    if (!product.id) {
      console.error("Invalid product ID", product);
      return;
    }
    try {
      await addCartItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        description: product.description,
        quantity: 1
      });
      await loadCart();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      console.error("User must be logged in to remove items from cart");
      return;
    }
    
    try {
      await deleteCartItem(productId);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, loadCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
