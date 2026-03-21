import React, { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="container-section cart-empty-view">
        <div className="empty-cart-content">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your anime collection yet.</p>
          <Link to="/catalog" className="btn-base btn-primary">Discover Treasures</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-section cart-page-section">
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
        <p className="cart-item-count">{cartItems.length} items in your bag</p>
      </div>

      <div className="cart-content-grid">
        <div className="cart-items-column">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-image">
                <img src={item.image_url} alt={item.name} loading="lazy" />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-head">
                  <h3>{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="cart-item-remove-btn" title="Remove item">
                    &times;
                  </button>
                </div>
                <p className="cart-item-unit-price">${item.price}</p>
                
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-amount">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-column">
          <div className="cart-summary-sticky-wrapper">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="total-amount">${cartTotal}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-base btn-primary checkout-btn">
                Proceed to Checkout
              </Link>
              <p className="secure-checkout-note">
                <span className="lock-icon">🔒</span> Secure Checkout
              </p>
            </div>
            <Link to="/catalog" className="continue-shopping-link">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
