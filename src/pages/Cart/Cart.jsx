import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/catalog" className="btn liquid">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price}</p>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <div className="cart-item-subtotal">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">×</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total:</h3>
          <span>${calculateTotal()}</span>
        </div>
        <Link to="/checkout" className="btn liquid checkout-btn">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;
