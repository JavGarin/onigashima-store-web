import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setProducts(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="catalog-container"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="catalog-container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="catalog-container">
      <h2>Our Catalog</h2>
      <p className="catalog-intro">Explore our collection of anime treasures. Find figures, apparel, and more!</p>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/catalog/${product.id}`} className="product-link">
              <div className="product-image-container">
                <img src={product.image_url} alt={product.name} />
                <span className="product-card-category">{product.category}</span>
              </div>
              <div className="product-card-info">
                <h3>{product.name}</h3>
                <p className="product-card-price">${product.price}</p>
              </div>
            </Link>
            <button className="btn liquid" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;