import React, { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const isEn = (i18n.resolvedLanguage || i18n.language || 'es').startsWith('en');
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="container-section cart-empty-view">
        <div className="empty-cart-content">
          <h2>{t('cart.emptyTitle')}</h2>
          <p>{t('cart.emptyDesc')}</p>
          <Link to="/catalog" className="btn-base btn-primary">{t('cart.discoverTreasures')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-section cart-page-section">
      <div className="cart-header">
        <h2>{t('cart.title')}</h2>
        <p className="cart-item-count">{t('cart.itemsInBag', { count: cartItems.length })}</p>
      </div>

      <div className="cart-content-grid">
        <div className="cart-items-column">
          {cartItems.map(item => {
            const itemName = (isEn && item.name_en) ? item.name_en : item.name;
            return (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.image_url} alt={itemName} loading="lazy" />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-head">
                    <h3>{itemName}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="cart-item-remove-btn" title={t('cart.removeItem')}>
                      &times;
                    </button>
                  </div>
                  <p className="cart-item-unit-price">${Number(item.price).toLocaleString(isEn ? 'en-US' : 'es-CL')}</p>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <div className="cart-item-subtotal">
                      <span className="subtotal-label">{t('cart.subtotal')}</span>
                      <span className="subtotal-amount">${Number(item.price * item.quantity).toLocaleString(isEn ? 'en-US' : 'es-CL')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary-column">
          <div className="cart-summary-sticky-wrapper">
            <div className="cart-summary-card">
              <h3>{t('cart.orderSummary')}</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>{t('cart.subtotal')}</span>
                  <span>${Number(cartTotal).toLocaleString(isEn ? 'en-US' : 'es-CL')}</span>
                </div>
                <div className="summary-row">
                  <span>{t('cart.shipping')}</span>
                  <span className="free-shipping">{t('cart.freeShipping')}</span>
                </div>
                <div className="summary-row total">
                  <span>{t('cart.total')}</span>
                  <span className="total-amount">${Number(cartTotal).toLocaleString(isEn ? 'en-US' : 'es-CL')}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-base btn-primary checkout-btn">
                {t('cart.proceedToCheckout')}
              </Link>
              <p className="secure-checkout-note">
                <span className="lock-icon">🔒</span> {t('cart.secureCheckout')}
              </p>
            </div>
            <Link to="/catalog" className="continue-shopping-link">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
