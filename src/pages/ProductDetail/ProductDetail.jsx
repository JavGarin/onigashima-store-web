import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, mockProducts } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedState, setAddedState] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const imgRef = useRef(null);

  const relatedProducts = product
    ? mockProducts.filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        await new Promise((resolve) => setTimeout(resolve, 280));
        const found = getProductById(id);
        if (found) {
          setProduct(found);
        } else {
          throw new Error(`Producto con ID ${id} no encontrado.`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAddedState(true);
    setTimeout(() => setAddedState(false), 2200);
  };

  if (loading) {
    return (
      <div className="pd-root">
        <div className="pd-loading-screen">
          <div className="pd-loading-spinner" aria-label="Cargando producto" />
          <span className="pd-loading-label">CARGANDO ARCHIVO...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-root">
        <div className="pd-error-screen">
          <span className="pd-error-code">404</span>
          <h2 className="pd-error-title">Pieza No Encontrada</h2>
          <p className="pd-error-desc">{error}</p>
          <Link to="/catalog" className="pd-btn-back-catalog">
            Volver al Catalogo
          </Link>
        </div>
      </div>
    );
  }

  const stockLevel =
    product.stock > 15 ? 'high' : product.stock > 5 ? 'mid' : 'low';
  const stockLabel =
    stockLevel === 'high'
      ? 'Disponible'
      : stockLevel === 'mid'
      ? 'Stock Limitado'
      : 'Ultimas Unidades';

  return (
    <div className="pd-root">
      <div className="pd-bg-canvas" aria-hidden="true">
        <div className="pd-bg-glow" />
        <div className="pd-bg-grid" />
      </div>

      <header className="pd-top-hud">
        <button
          type="button"
          className="pd-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver atras"
        >
          &larr; ATRAS
        </button>
        <div className="pd-hud-breadcrumb">
          <Link to="/" className="pd-hud-crumb-link">INICIO</Link>
          <span className="pd-hud-crumb-sep">/</span>
          <Link to="/catalog" className="pd-hud-crumb-link">CATALOGO</Link>
          <span className="pd-hud-crumb-sep">/</span>
          <span className="pd-hud-crumb-active">{product.category.toUpperCase()}</span>
        </div>
        <div className="pd-hud-right">
          <span className="pd-hud-live-dot" aria-hidden="true" />
          <span className="pd-hud-archive">ARCHIVO &middot; 2026</span>
        </div>
      </header>

      <main className="pd-main-layout" id="product-detail-main">
        <section className="pd-image-panel" aria-label="Imagen del producto">
          <div className="pd-image-frame">
            <div className="pd-image-corner tl" aria-hidden="true" />
            <div className="pd-image-corner tr" aria-hidden="true" />
            <div className="pd-image-corner bl" aria-hidden="true" />
            <div className="pd-image-corner br" aria-hidden="true" />
            <div className={"pd-image-wrap" + (imageLoaded ? " loaded" : "")}>
              <img
                ref={imgRef}
                src={product.image_url}
                alt={product.name}
                className="pd-product-img"
                onLoad={() => setImageLoaded(true)}
                loading="eager"
              />
            </div>
            <span className="pd-img-badge-cat">{product.category}</span>
            {product.tags && product.tags[0] && (
              <span className="pd-img-badge-tag">{product.tags[0]}</span>
            )}
          </div>
          {product.tags && product.tags.length > 1 && (
            <div className="pd-tags-row">
              {product.tags.map((tag, i) => (
                <span key={i} className="pd-tag-chip">{tag}</span>
              ))}
            </div>
          )}
        </section>

        <section className="pd-info-panel" aria-label="Informacion del producto">
          <div className="pd-info-head">
            <span className="pd-info-category">{product.category.toUpperCase()}</span>
            <h1 className="pd-info-title">{product.name}</h1>
          </div>

          <div className="pd-rating-row" aria-label={"Valoracion: " + product.rating + " de 5"}>
            <div className="pd-stars" role="img" aria-label={product.rating + " estrellas"}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={"pd-star" + (i < Math.floor(product.rating) ? " filled" : i < product.rating ? " half" : "")}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <span className="pd-rating-score">{product.rating}</span>
            <span className="pd-rating-reviews">({product.reviews} resenas)</span>
          </div>

          <p className="pd-description">{product.description}</p>

          <div className="pd-section-divider" aria-hidden="true" />

          <div className="pd-meta-grid">
            <div className="pd-meta-item">
              <span className="pd-meta-label">ESTADO</span>
              <span className={"pd-meta-value pd-stock-" + stockLevel}>
                <span className="pd-stock-dot" aria-hidden="true" />
                {stockLabel}
              </span>
            </div>
            <div className="pd-meta-item">
              <span className="pd-meta-label">UNIDADES</span>
              <span className="pd-meta-value">{product.stock} disp.</span>
            </div>
            <div className="pd-meta-item">
              <span className="pd-meta-label">ID REF</span>
              <span className="pd-meta-value pd-meta-mono">#ONI-{String(product.id).padStart(4, '0')}</span>
            </div>
          </div>

          <div className="pd-section-divider" aria-hidden="true" />

          <div className="pd-purchase-block">
            <div className="pd-price-block">
              <span className="pd-price-label">PRECIO</span>
              <span className="pd-price-amount">
                ${Number(product.price).toLocaleString('es-CL')}
              </span>
              <span className="pd-price-currency">CLP</span>
            </div>
            <div className="pd-cta-row">
              <button
                id={"add-to-cart-" + product.id}
                className={"pd-btn-add-cart" + (addedState ? " added" : "")}
                onClick={handleAddToCart}
                aria-label={"Anadir " + product.name + " al carrito"}
                disabled={addedState}
              >
                {addedState ? "ANADIDO AL CARRITO" : "+ AGREGAR AL CARRITO"}
              </button>
              <Link to="/cart" className="pd-btn-go-cart" aria-label="Ir al carrito">
                &#128722;
              </Link>
            </div>
          </div>

          <div className="pd-auth-strip">
            <span className="pd-auth-icon">&#128737;</span>
            <span className="pd-auth-text">
              Autenticidad garantizada &middot; Importado desde Japon &middot; Sello oficial verificado
            </span>
          </div>
        </section>
      </main>

      {relatedProducts.length > 0 && (
        <section className="pd-related-section" aria-label="Productos relacionados">
          <div className="pd-related-header">
            <span className="pd-related-live-dot" aria-hidden="true" />
            <h2 className="pd-related-title">TAMBIEN TE PUEDE INTERESAR</h2>
            <Link to="/catalog" className="pd-related-ver-todo">Ver todo &rarr;</Link>
          </div>
          <div className="pd-related-grid">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={"/catalog/" + rel.id}
                className="pd-related-card"
                aria-label={"Ver " + rel.name}
              >
                <div className="pd-related-img-wrap">
                  <img
                    src={rel.image_url}
                    alt={rel.name}
                    className="pd-related-img"
                    loading="lazy"
                  />
                  <span className="pd-related-cat">{rel.category}</span>
                </div>
                <div className="pd-related-info">
                  <span className="pd-related-name">{rel.name}</span>
                  <span className="pd-related-price">
                    ${Number(rel.price).toLocaleString('es-CL')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="pd-watermark" aria-hidden="true">
        <span>ONIGASHIMA STORE&#174; // TOKYO &middot; SANTIAGO</span>
        <span className="pd-watermark-sub">EDICION LIMITADA &amp; ARCHIVO OFICIAL 2026</span>
      </div>
    </div>
  );
};

export default ProductDetail;
