import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Login from './pages/Login/Login';
import Footer from './components/Footer/Footer';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout'; // Import Checkout

// Helper component for protected routes
const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <CartProvider>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
