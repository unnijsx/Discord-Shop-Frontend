// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage on component mount
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      return [];
    }
  });

  // Update localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (productId is MongoDB _id)
  const addToCart = (productToAdd, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === productToAdd._id);

      // Get the effective price (discounted or original)
      const effectivePrice = productToAdd.discountPrice !== undefined ? productToAdd.discountPrice : productToAdd.price;

      if (existingItemIndex > -1) {
        // If item exists, increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // If item is new, add it
        return [
          ...prevItems,
          {
            productId: productToAdd._id, // Store MongoDB _id
            name: productToAdd.name,
            price: effectivePrice,
            image: productToAdd.image,
            quantity: quantity
          }
        ];
      }
    });
  };

  // Increase quantity of an item
  const increaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity of an item
  const decreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0) // Remove item if quantity drops to 0
    );
  };

  // Remove item from cart
  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart (for badge)
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total amount of items in cart
  const getTotalAmount = () => {
    // Note: prices stored in cartItems may be outdated if product prices change on backend.
    // For final calculation on checkout, it's safer to fetch fresh product prices from backend.
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems, // Provide setCartItems directly if components need full control
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        getTotalItems,
        getTotalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};