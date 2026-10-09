import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import { getAllProducts, getAllCategories } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import Spinner from '../../components/Spinner/Spinner';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const comp = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

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

  // Ocultar el indicador de scroll cuando el usuario comienza a hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollHint(scrollY < 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="container-section catalog-section" ref={comp} style={{ position: 'relative' }}>
      <div className="catalog-content" style={{ visibility: loading && !products.length ? 'hidden' : 'visible' }}>
        <div className="catalog-header">
          <span className="catalog-header-badge">// Onigashima Store 2026</span>
          <div className="catalog-title-wrap">
            <img src="/onigashima_store_logo.avif" alt="Onigashima Store Logo" className="catalog-logo" />
            <h2>Curated Archive Catalog</h2>
          </div>
        </div>
        <p className="catalog-intro">Tienda internacional de figuras y productos de autor coleccionables oficiales premium con envíos a todo el mundo.</p>
        
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
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products-msg">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indicador de Scroll */}
      <div
        className="catalog-scroll-indicator"
        style={{
          opacity: showScrollHint ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.5s ease',
        }}
        aria-hidden="true"
      >
        <span className="scroll-hint-label">SCROLL</span>
        <div className="scroll-hint-arrow">
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5.5" y="0.5" width="5" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="8" y1="3" x2="8" y2="5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M1 15l7 6 7-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
