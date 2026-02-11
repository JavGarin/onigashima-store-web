import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // El estado del carrito, inicializado desde localStorage para persistencia
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  const [notification, setNotification] = useState('');
  const [notificationTimer, setNotificationTimer] = useState(null);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (message) => {
    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }
    setNotification(message);
    const timer = setTimeout(() => {
      setNotification('');
    }, 3000);
    setNotificationTimer(timer);
  };

  // Función para añadir un producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Si el item ya existe, incrementa la cantidad
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si es un item nuevo, lo añade con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    showNotification(`"${product.name}" has been added to the cart!`);
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, amount) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean); // Elimina los items que quedaron en null (cantidad 0)
    });
  };

  // Calcular el número total de items
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // El valor que será accesible por los componentes hijos
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    notification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
