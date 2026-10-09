import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <Link to={`/catalog/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="product-img-primary"
          />
          {product.image_url_2 && (
            <img
              src={product.image_url_2}
              alt={`${product.name} — vista alternativa`}
              loading="lazy"
              className="product-img-secondary"
            />
          )}
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
            <p className="product-card-price">${Number(product.price).toLocaleString('es-CL')}</p>
          </div>
        </div>
      </Link>
      <button className="btn-base btn-primary" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};



export default ProductCard;
