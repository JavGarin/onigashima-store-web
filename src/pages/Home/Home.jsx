import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Importar el cliente de Supabase
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import videoBg from '../../assets/video/FLCL.webm';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const indicator = document.querySelector('.scroll-down-indicator');
      if (indicator) {
        if (window.scrollY > 50) {
          indicator.classList.add('hidden');
        } else {
          indicator.classList.remove('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Pedimos los 5 productos más recientes
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        if (data) {
          // Añadimos etiquetas de ejemplo, ya que no vienen de la DB
          const taggedData = data.map((p, i) => {
              const tags = ['New', 'Best Seller', 'On Sale', 'Just Arrived', 'Online Exclusive'];
              return {...p, tag: tags[i % tags.length]};
          });
          setFeaturedProducts(taggedData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useLayoutEffect(() => {
    if (!loading) {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.featured-products',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.from('.featured-title', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out'
      });

      gsap.utils.toArray('.featured-product-row').forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          y: 100,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });
      });
    }
  }, [loading]);

  return (
    <>
      <div className="hero-container">
        <video src={videoBg} autoPlay loop muted />
        <div className="hero-content">
          <h1>Onigashima Store</h1>
          <p>Your universe of anime collectibles</p>
        </div>
        <div className="scroll-down-indicator"></div>
      </div>

      <section className="featured-products">
        <h2 className="featured-title">Our Featured Products</h2>
        
        {loading && <p style={{textAlign: 'center'}}>Loading featured products...</p>}
        {error && <p style={{textAlign: 'center'}}>Error: {error}</p>}
        
        {!loading && !error && (
          <div className="featured-grid">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`featured-product-row ${index % 2 !== 0 ? 'reversed' : ''}`}>
                <div className="featured-product-image">
                  <img src={product.image_url} alt={product.name} />
                </div>
                <div className="featured-product-info">
                  <span className="featured-product-tag">{product.tag}</span>
                  <h3>{product.name}</h3>
                  <p className="featured-product-description">{product.description}</p>
                  <div className="featured-product-purchase">
                    <span className="featured-product-price">${product.price}</span>
                    <Link to={`/catalog/${product.id}`} className="btn liquid">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
