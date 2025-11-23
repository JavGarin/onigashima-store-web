import React from 'react';
import { useCart } from '../../context/CartContext';
import './AddToCartNotification.css';

const AddToCartNotification = () => {
  const { notification } = useCart();

  return (
    <div className={`notification-container ${notification ? 'show' : ''}`}>
      {notification}
    </div>
  );
};

export default AddToCartNotification;
