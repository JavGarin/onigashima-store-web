import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      // Usar requestAnimationFrame o un simple check para rendimiento
      const scrolled = window.scrollY > 20;
      setIsScrolled(prev => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // En la home page, el marco Neo-Frame Canvas gestiona su propio header perimetral
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/onigashima_store_logo.avif" alt="Onigashima Logo" className="navbar-logo-img" />
          <span className="navbar-brand-name">Onigashima</span>
        </Link>
        
        <div className="navbar-desktop-menu">
          <Link to="/" className="nav-link">{t('navbar.home')}</Link>
          <Link to="/catalog" className="nav-link">{t('navbar.catalog')}</Link>
          {user ? (
             <span className="nav-user-greeting">{t('navbar.hi')}, {user.email.split('@')[0]}</span>
          ) : (
             <Link to="/login" className="nav-link">{t('navbar.login')}</Link>
          )}
        </div>

        <div className="navbar-actions">
          <LanguageToggle />
          <Link to="/cart" className="nav-cart-link" aria-label={`Shopping cart icon, you have ${cartCount} items`}>
            <svg className="cart-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.2997 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="cart-icon-text">{t('navbar.cart')}</span>
            {cartCount > 0 && <span className="cart-badge-pill">{cartCount}</span>}
          </Link>
          
          {user && (
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="nav-logout-pill" aria-label="Logout session">
              {t('navbar.logout')}
            </button>
          )}

          <button 
            className="menu-icon-trigger" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div 
        className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">&times;</button>
        
        <div className="mobile-sidebar-header">
          <img src="/onigashima_store_logo.avif" alt="Onigashima Logo" className="mobile-sidebar-logo" />
          <h3>Onigashima</h3>
        </div>

        <div className="mobile-nav-links">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.home')}</Link>
          <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.catalog')}</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.cart')} <span className="mobile-cart-count">({cartCount})</span>
          </Link>
          
          <div className="mobile-divider"></div>
          
          {user ? (
             <div className="mobile-auth-info">
               <p className="mobile-user-email">{t('navbar.loggedAs')}: <span>{user.email}</span></p>
               <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn-base btn-outline-error">
                 {t('navbar.logout')}
               </button>
             </div>
          ) : (
             <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-login-link">
               {t('navbar.login')}
             </Link>
          )}
        </div>

        <div className="mobile-sidebar-footer">
          <h4>{t('navbar.supportTitle')}</h4>
          <p>{t('navbar.helpCenter')}</p>
          <p>{t('navbar.trackOrder')}</p>
          <div className="mobile-social-minimal">
            <span>{t('navbar.followUs')}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;