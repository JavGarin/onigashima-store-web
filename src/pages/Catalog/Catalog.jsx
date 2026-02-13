import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import { getAllProducts, getAllCategories } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import Spinner from '../../components/Spinner/Spinner';
import './Catalog.css';
import logoOnigashima from '../../assets/img/logoOnigashimaStore.svg';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const comp = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get all products and categories
        const allProducts = getAllProducts();
        const allCats = getAllCategories();

        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setCategories(allCats);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  useLayoutEffect(() => {
    if (error || loading) return;

    const ctx = gsap.context(() => {
      gsap.set('.catalog-content, .product-grid', { autoAlpha: 1 });
      
      // Animate products when filter changes
      gsap.fromTo('.product-card', 
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, overwrite: 'auto' }
      );
      
    }, comp);

    return () => ctx.revert();

  }, [loading, error, filteredProducts]); // Re-run animation when filteredProducts changes

  if (error) {
    return <div className="catalog-container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="container-section catalog-section" ref={comp}>
      <div className="catalog-content" style={{ visibility: loading && !products.length ? 'hidden' : 'visible' }}>
        <div className="catalog-header">
          <img src={logoOnigashima} alt="Onigashima Store Logo" className="catalog-logo" />
          <h2>Our Catalog</h2>
        </div>
        <p className="catalog-intro">Explore our full collection of anime treasures.</p>
        
        {/* Category Filter Bar */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {loading && <Spinner />}
        
        {!loading && (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/catalog/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                    <span className="product-card-category">{product.category}</span>
                    {product.tags && product.tags.length > 0 && (
                      <span className="product-card-tag">{product.tags[0]}</span>
                    )}
                  </div>
                  <div className="product-card-info">
                    <h3>{product.name}</h3>
                    <div className="product-card-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="product-card-bottom">
                      <p className="product-card-price">${product.price}</p>
                    </div>
                  </div>
                </Link>
                <button className="btn-base btn-primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products-msg">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
