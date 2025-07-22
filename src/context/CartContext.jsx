import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('foodease-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever cartItems change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('foodease-cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (food) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === food._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...food, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== foodId));
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === foodId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};