import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear un hook personalizado para usar el contexto del carrito más fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Crear el componente Provider
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

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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

  // El valor que será accesible por los componentes hijos
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
