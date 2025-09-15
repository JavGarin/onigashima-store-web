import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    // In a real app, you would handle the payment processing here.
    alert(`Purchase complete!\nTotal: $${calculateTotal()}\nPayment Method: ${paymentMethod}`);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Confirm Your Order</h2>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong>${calculateTotal()}</strong>
          </div>
        </div>

        <form className="payment-form" onSubmit={handlePurchase}>
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="credit-card" 
                checked={paymentMethod === 'credit-card'}
                onChange={() => setPaymentMethod('credit-card')}
              />
              Credit Card
            </label>
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="paypal" 
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              PayPal
            </label>
          </div>
          <button type="submit" className="btn liquid confirm-btn">Confirm Purchase</button>
        </form>

        <Link to="/cart" className="btn-back">&larr; Back to Cart</Link>
      </div>
    </div>
  );
};

export default Checkout;
