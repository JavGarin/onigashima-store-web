import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
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

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="product-detail-container"><p>Loading product...</p></div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-container not-found">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <Link to="/catalog" className="btn-back">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-stock">In Stock: {product.stock}</p>
          <div className="product-purchase-section">
            <span className="product-price">${product.price}</span>
            {/* Update onClick to use addToCart */}
            <button className="btn liquid" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
           <Link to="/catalog" className="btn-back"> &larr; Back to Catalog</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
