import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`side-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* Logo removed */}
        </Link>
        
        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''} side-menu`}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            &times;
          </button>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
          
          {user ? (
             <span className="user-greeting">Hello, {user.email}</span>
          ) : (
             <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          )}

           <Link to="/cart" className="valid-cart-icon" onClick={() => setIsMobileMenuOpen(false)}>
              Cart
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
           </Link>
           
           {user && (
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="logout-btn">Logout</button>
           )}
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;