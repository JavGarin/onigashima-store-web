import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, mockProducts } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const globalSatisfactionReviews = [
  { id: 1, flag: '🇯🇵', user: 'Haruto S.', location: 'Tokio, Japón', text: '造形も塗装も完璧。梱包も丁寧で感動しました！' },
  { id: 2, flag: '🇺🇸', user: 'Marcus K.', location: 'Nueva York, EE. UU.', text: 'Museum-grade detail. Fast priority international shipping.' },
  { id: 3, flag: '🇨🇱', user: 'Valentina R.', location: 'Santiago, Chile', text: 'Llegó impecable y protegido, 100% original con sello oficial.' },
  { id: 4, flag: '🇫🇷', user: 'Alexandre B.', location: 'París, Francia', text: 'Détails époustouflants, la véritable pièce maîtresse !' },
  { id: 5, flag: '🇩🇪', user: 'Lukas M.', location: 'Berlín, Alemania', text: 'Unglaubliche Qualität und absolut bombensichere Verpackung.' },
  { id: 6, flag: '🇮🇹', user: 'Giulia C.', location: 'Milán, Italia', text: 'Arrivato perfetto in pochissimi giorni. Semplicemente magnifica!' },
  { id: 7, flag: '🇰🇷', user: 'Min-Jun P.', location: 'Seúl, Corea del Sur', text: '마감과 디테일이 예술입니다. 소장 가치 100% 만족!' },
  { id: 8, flag: '🇧🇷', user: 'Lucas S.', location: 'São Paulo, Brasil', text: 'Chegou super rápido no Brasil e perfeitamente protegido.' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedState, setAddedState] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const { addToCart } = useCart();
  const imgRef = useRef(null);

  useEffect(() => {
    if (isReviewPaused) return;
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % globalSatisfactionReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isReviewPaused]);

  // Construir array de imágenes disponibles del producto
  const productImages = product
    ? [
        { src: product.image_url, label: 'Vista 01' },
        ...(product.image_url_2
          ? [{ src: product.image_url_2, label: 'Vista 02' }]
          : []),
      ]
    : [];

  const relatedProducts = product
    ? mockProducts.filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        setActiveImage(0);
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
          <span className="pd-loading-label">CARGANDO PRODUCTO...</span>
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
          <span className="pd-hud-archive">Onigashima Store 2026</span>
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
                src={productImages[activeImage]?.src || product.image_url}
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
            {/* Indicador de vista activa */}
            {productImages.length > 1 && (
              <span className="pd-img-view-badge" aria-live="polite">
                {productImages[activeImage]?.label}
              </span>
            )}
          </div>

          {/* Fila con elementos de vista de imágenes y carrusel minimalista transparente de satisfacción */}
          <div className="pd-views-strip">
            {productImages.length > 1 && (
              <div className="pd-gallery-thumbs" role="list" aria-label="Galería de imágenes del producto">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    role="listitem"
                    className={"pd-thumb-btn" + (activeImage === i ? " active" : "")}
                    onClick={() => { setActiveImage(i); setImageLoaded(false); }}
                    aria-label={`Ver ${img.label}`}
                    aria-pressed={activeImage === i}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="pd-thumb-img"
                      loading="lazy"
                    />
                    <span className="pd-thumb-label">{img.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Carrusel minimalista transparente de satisfacción global */}
            <aside
              className="pd-reviews-carousel"
              onMouseEnter={() => setIsReviewPaused(true)}
              onMouseLeave={() => setIsReviewPaused(false)}
              aria-label="Comentarios de satisfacción de clientes globales"
            >
              <div className="pd-rev-header">
                <div className="pd-rev-badge">
                  <span className="pd-rev-live-dot" aria-hidden="true" />
                  <span className="pd-rev-badge-txt">SATISFACCIÓN GLOBAL</span>
                </div>
                <div className="pd-rev-nav">
                  <button
                    type="button"
                    className="pd-rev-arrow"
                    onClick={() => setReviewIndex((prev) => (prev - 1 + globalSatisfactionReviews.length) % globalSatisfactionReviews.length)}
                    aria-label="Comentario anterior"
                  >
                    &#8249;
                  </button>
                  <span className="pd-rev-counter">
                    {String(reviewIndex + 1).padStart(2, '0')}/{String(globalSatisfactionReviews.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="pd-rev-arrow"
                    onClick={() => setReviewIndex((prev) => (prev + 1) % globalSatisfactionReviews.length)}
                    aria-label="Siguiente comentario"
                  >
                    &#8250;
                  </button>
                </div>
              </div>

              <div className="pd-rev-body" key={reviewIndex}>
                <p className="pd-rev-quote">"{globalSatisfactionReviews[reviewIndex].text}"</p>
                <div className="pd-rev-meta">
                  <span className="pd-rev-stars">★★★★★</span>
                  <span className="pd-rev-user">
                    {globalSatisfactionReviews[reviewIndex].flag} {globalSatisfactionReviews[reviewIndex].user}
                  </span>
                  <span className="pd-rev-city">&middot; {globalSatisfactionReviews[reviewIndex].location}</span>
                </div>
              </div>
            </aside>
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
              Importación oficial &middot; Figuras y productos de autor coleccionables premium &middot; Envíos a todo el mundo
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
        <span className="pd-watermark-sub">EDICION LIMITADA &amp; ONIGASHIMA STORE 2026</span>
      </div>
    </div>
  );
};

export default ProductDetail;
