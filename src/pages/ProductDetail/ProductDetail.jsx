import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import { getProductById } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext'; // Import useCart
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart function

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get product from mock data
        const foundProduct = getProductById(id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error(`Product with ID ${id} does not exist.`);
        }

        /* SUPABASE LOGIC - Commented for demo mode
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(`Could not find the product. Reason: ${error.message}`);
        }

        if (data) {
          setProduct(data);
        } else {
          throw new Error(`Product with ID ${id} does not exist.`);
        }
        */

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container-section product-detail-loading"><p>Loading product...</p></div>;
  }

  if (error || !product) {
    return (
      <div className="container-section product-detail-not-found">
        <div className="not-found-content">
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <Link to="/catalog" className="btn-base btn-primary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-section product-detail-section">
      <div className="product-detail-card">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.name} loading="lazy" />
        </div>
        <div className="product-detail-info">
          <div className="product-detail-head">
            <span className="product-category-tag">{product.category}</span>
            <h1>{product.name}</h1>
          </div>

          <div className="product-detail-rating">
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

          <p className="product-description">{product.description}</p>
          
          <div className="product-detail-meta">
            <p className="product-stock-status">
              <span className="dot"></span> In Stock: {product.stock} units
            </p>
          </div>

          <div className="product-purchase-section">
            <div className="product-price-wrapper">
              <span className="price-label">Price</span>
              <span className="product-price-amount">${product.price}</span>
            </div>
            <button className="btn-base btn-primary product-add-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
          
          <Link to="/catalog" className="product-detail-back-link">
            &larr; Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
