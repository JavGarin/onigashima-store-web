import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import { gsap } from 'gsap';
import Spinner from '../../components/Spinner/Spinner';
import './Catalog.css';

const PRODUCTS_PER_PAGE = 8;

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const comp = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        const from = currentPage * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        // Get the total count of products
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        setProductCount(count);
        
        // Fetch the paginated data
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        if (data) setProducts(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  useLayoutEffect(() => {
    if (error || loading) return;

    const ctx = gsap.context(() => {
      gsap.set('.catalog-content, .product-grid', { autoAlpha: 1 });
      
      const tl = gsap.timeline();
      
      // Animate title and intro once
      if (currentPage === 0) {
        tl.from('.catalog-container h2, .catalog-intro', {
            autoAlpha: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.2,
          });
      }
      
      // Animate product cards every time products change
      gsap.from('.product-card', {
        autoAlpha: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
      });

    }, comp);

    return () => ctx.revert();

  }, [loading, error, products]);

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = (currentPage + 1) * PRODUCTS_PER_PAGE >= productCount;

  if (error) {
    return <div className="catalog-container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="catalog-container" ref={comp}>
      <div className="catalog-content" style={{ visibility: loading && !products.length ? 'hidden' : 'visible' }}>
        <h2>Our Catalog</h2>
        <p className="catalog-intro">Explore our collection of anime treasures. Find figures, apparel, and more!</p>
        
        {loading && <Spinner />}
        
        {!loading && (
          <>
            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/catalog/${product.id}`} className="product-link">
                    <div className="product-image-container">
                      <img src={product.image_url} alt={product.name} loading="lazy" />
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

            <div className="pagination-controls">
              <button onClick={handlePrevPage} disabled={isPrevDisabled}>
                Previous
              </button>
              <span>Page {currentPage + 1}</span>
              <button onClick={handleNextPage} disabled={isNextDisabled}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
