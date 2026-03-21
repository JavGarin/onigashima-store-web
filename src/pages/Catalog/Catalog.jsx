import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import { getAllProducts, getAllCategories } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import Spinner from '../../components/Spinner/Spinner';
import ProductCard from '../../components/ProductCard/ProductCard';
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
    </div>
  );
};

export default Catalog;
