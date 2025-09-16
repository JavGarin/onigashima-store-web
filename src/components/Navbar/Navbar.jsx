import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toggleMenu();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? 'Close' : 'Menu'}
      </button>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/catalog" onClick={toggleMenu}>Catalog</Link></li>
          {isAuthenticated ? (
            <li><button onClick={handleLogoutClick} className="logout-button">Logout</button></li>
          ) : (
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          )}
          <li className="cart-link-container">
            <Link to="/cart" className="cart-link" onClick={toggleMenu}>
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;