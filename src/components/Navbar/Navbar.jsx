import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import the useCart hook
import './Navbar.css';

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart(); // Get cart items from context

  // Calculate total number of items in the cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    handleLogout();
    toggleMenu();
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