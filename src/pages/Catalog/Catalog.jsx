import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import Spinner from '../../components/Spinner/Spinner';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const comp = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useLayoutEffect(() => {
    if (error) return;
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.set('.catalog-content', { autoAlpha: 1 }); // Use autoAlpha for opacity and visibility
      const tl = gsap.timeline();
      
      tl.from('.catalog-container h2, .catalog-intro', {
          autoAlpha: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.2,
        })
        .from('.product-card', {
          autoAlpha: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.1,
        });
    }, comp);

    return () => ctx.revert();

  }, [loading, error]);

  if (error) {
    return <div className="catalog-container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="catalog-container" ref={comp}>
      {loading && <Spinner />}
      <div className="catalog-content" style={{ visibility: loading ? 'hidden' : 'visible' }}>
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
    </div>
  );
};

export default Catalog;
