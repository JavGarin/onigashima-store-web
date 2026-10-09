import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getFeaturedProducts } from '../../data/mockProducts';
import './Home.css';
import videoBg from '../../assets/video/FLCL.webm';
import battle1Bg from '../../assets/video/battle1.webm';

const videos = [videoBg, battle1Bg];

const Home = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  // Cart & Auth Contexts
  const { cartCount, addToCart } = useCart();
  const { user } = useAuth();

  // Floating Panel Drawer State
  const [activePanelKey, setActivePanelKey] = useState(null);
  const [panelContent, setPanelContent] = useState({ title: '', body: '' });

  // Carousel Products & State
  const featuredProducts = getFeaturedProducts(6);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Predefined panel details
  const panelsData = {
    about: {
      title: 'Acerca de Onigashima',
      body: 'Onigashima Store es una tienda internacional de venta de figuras y productos de autor coleccionables y oficiales premium, con envíos a todo el mundo. Garantizamos sellos de autenticidad TOEI, Kotobukiya, Bandai Spirits y Good Smile Company.'
    },
    shipping: {
      title: 'Importación & Envíos Globales',
      body: 'Empacamos cada pieza con protección de grado coleccionista (cajas dobles de alto impacto y sellado hidrófugo). Envíos exprés a todo el mundo con número de rastreo prioritario y seguro contra daños al 100% del valor declarado.'
    },
    contact: {
      title: 'Contacto & Atención',
      body: '¿Buscas una figura exclusiva o preventa agotada? Nuestro concierge en Tokio busca piezas por encargo. Escríbenos a concierge@onigashimastore.io o encuéntranos en nuestras redes @onigashima_store.'
    }
  };

  const openPanel = (key) => {
    if (activePanelKey === key) {
      closePanel();
      return;
    }
    setActivePanelKey(key);
    setPanelContent(panelsData[key] || { title: '', body: '' });
  };

  const closePanel = () => {
    setActivePanelKey(null);
  };

  // Video Playlist Logic & Performance Optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      if (video && video.paused) {
        video.play().catch(() => {
          // Autoplay puede requerir interacción previa del usuario
        });
      }
    };

    playVideo();

    // Pausar el render del video si la pestaña está oculta para liberar CPU/GPU
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('resize', playVideo, { passive: true });
    window.addEventListener('orientationchange', playVideo, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', playVideo);
      window.removeEventListener('orientationchange', playVideo);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const togglePlayVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const cycleVideoClip = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsVideoPlaying(true);
  };

  // === Sistema de Carrusel por Lotes Sincronizados (Awwwards 2026) ===
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 580) {
        setItemsPerPage(1);
      } else if (width <= 900) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agrupamiento exacto de productos en lotes (tríos en desktop, pares en tablet, individual en mobile)
  const productBatches = useMemo(() => {
    const batches = [];
    for (let i = 0; i < featuredProducts.length; i += itemsPerPage) {
      batches.push(featuredProducts.slice(i, i + itemsPerPage));
    }
    return batches;
  }, [featuredProducts, itemsPerPage]);

  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [timelineKey, setTimelineKey] = useState(0);
  const autoplayResumeTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);

  // Asegurar índice válido si cambia el tamaño de pantalla
  useEffect(() => {
    if (activeBatchIndex >= productBatches.length) {
      setActiveBatchIndex(Math.max(0, productBatches.length - 1));
      setTimelineKey((k) => k + 1);
    }
  }, [productBatches.length, activeBatchIndex]);

  const pauseAutoplayTemporarily = (delay = 5500) => {
    setIsCarouselPaused(true);
    if (autoplayResumeTimeoutRef.current) {
      clearTimeout(autoplayResumeTimeoutRef.current);
    }
    autoplayResumeTimeoutRef.current = setTimeout(() => {
      setIsCarouselPaused(false);
      setTimelineKey((k) => k + 1);
    }, delay);
  };

  const goToBatch = (index) => {
    pauseAutoplayTemporarily(6000);
    setActiveBatchIndex(index);
    setTimelineKey((k) => k + 1);
  };

  const nextBatch = () => {
    if (productBatches.length <= 1) return;
    pauseAutoplayTemporarily(6000);
    setActiveBatchIndex((prev) => (prev + 1) % productBatches.length);
    setTimelineKey((k) => k + 1);
  };

  const prevBatch = () => {
    if (productBatches.length <= 1) return;
    pauseAutoplayTemporarily(6000);
    setActiveBatchIndex((prev) => (prev - 1 + productBatches.length) % productBatches.length);
    setTimelineKey((k) => k + 1);
  };

  // Autoplay con ciclo de 5 segundos
  useEffect(() => {
    if (isCarouselPaused || productBatches.length <= 1) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      setActiveBatchIndex((prev) => (prev + 1) % productBatches.length);
      setTimelineKey((k) => k + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isCarouselPaused, productBatches.length, timelineKey]);

  useEffect(() => {
    return () => {
      if (autoplayResumeTimeoutRef.current) {
        clearTimeout(autoplayResumeTimeoutRef.current);
      }
    };
  }, []);

  // Gestos táctiles fluidos (Mobile Swipe)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsCarouselPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 45) {
      nextBatch();
    } else if (diff < -45) {
      prevBatch();
    }
    touchStartXRef.current = null;
    pauseAutoplayTemporarily(5500);
  };

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1500);
  };

  return (
    <div className="neo-viewport-root">
      {/* Capa 1: Fondo Exterior Rosa Oscuro de Alto Contraste */}
      <div className="background-canvas">
        <div className="canvas-rose-glow" />
        <div className="canvas-grid-glow" />
      </div>

      {/* Capa 2: Marco Flotante Suspendido con Video Confinado */}
      <main className="main-container">
        <div className="content-frame">
          
          {/* Capa de Video: reproducido únicamente dentro del contenedor */}
          <div className="frame-video-layer">
            <video 
              ref={videoRef}
              src={videos[currentVideoIndex]} 
              autoPlay 
              muted 
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onEnded={handleVideoEnd}
              className="frame-video-element"
            />
            <div className="frame-video-overlay" />
          </div>

          {/* Vértice Superior: Header & Acciones Rápidas */}
          <header className="frame-header">
            <div className="brand">
              <Link to="/" className="brand-logo-link">
                <img src="/onigashima_store_logo.avif" alt="Onigashima Store Logo" className="brand-logo-img" />
                <div className="brand-texts">
                  <h1 className="brand-title">ONIGASHIMA STORE</h1>
                  <h2 className="brand-subtitle">Anime Collectibles & Archive Figures</h2>
                </div>
              </Link>
            </div>

            <div className="header-actions">
              {user ? (
                <span className="user-pill">
                  {user.email.split('@')[0]}
                </span>
              ) : (
                <Link to="/login" className="user-login-link">
                  Log in
                </Link>
              )}

              <Link to="/cart" className="cart-pill-btn" aria-label={`Carrito de compra: ${cartCount} items`}>
                <svg className="cart-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H21L19 13H7.5M20 17H8L6 3H3M9 20.5C9.27614 20.5 9.5 20.2761 9.5 20C9.5 19.7239 9.27614 19.5 9 19.5C8.72386 19.5 8.5 19.7239 8.5 20C8.5 20.2761 8.72386 20.5 9 20.5ZM19 20.5C19.2761 20.5 19.5 20.2761 19.5 20C19.5 19.7239 19.2761 19.5 19 19.5C18.7239 19.5 18.5 19.7239 18.5 20C18.5 20.2761 18.7239 20.5 19 20.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="cart-text">Cart</span>
                {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
              </Link>
            </div>
          </header>

          {/* Panel Desplegable Flotante (Glassmorphism) */}
          {activePanelKey && (
            <aside className="floating-panel" role="dialog" aria-modal="true">
              <button className="close-btn" onClick={closePanel} aria-label="Cerrar panel">&times;</button>
              <div className="panel-inner">
                <span className="panel-tag">// INFORMACIÓN EXCLUSIVA</span>
                <h3 className="panel-heading">{panelContent.title}</h3>
                <p className="panel-text">{panelContent.body}</p>
                <div className="panel-footer-action">
                  <Link to="/catalog" className="btn-base btn-primary">
                    Explorar Catálogo Completo &rarr;
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* Área Central: Hero Statement, Logotipo Maestro & Carrusel con Corte Diagonal */}
          <section className="hero-center-showcase">
            <div className="hero-identity-grid">
              {/* HUD Video Player — Overlay flotante absoluto en esquina superior derecha */}
              <div className="hero-video-hud" aria-label="Controles del video de fondo">
                <span className={`video-hud-pulse ${isVideoPlaying ? 'playing' : 'paused'}`} />
                <span className="video-hud-feed">
                  {isVideoPlaying ? `CLIP 0${currentVideoIndex + 1}` : 'PAUSA'}
                </span>
                <button 
                  type="button" 
                  onClick={togglePlayVideo}
                  className="video-hud-btn"
                  aria-label={isVideoPlaying ? "Pausar video" : "Reproducir video"}
                >
                  {isVideoPlaying ? '❚❚' : '▶'}
                </button>
                <button 
                  type="button" 
                  onClick={cycleVideoClip}
                  className="video-hud-btn video-hud-btn-switch"
                  aria-label="Cambiar siguiente clip de video"
                >
                  ⇄ CLIP
                </button>
              </div>

              {/* Logotipo Maestro de Gran Formato en el Hero */}
              <div className="hero-logo-showcase" aria-label="Logotipo oficial de Onigashima Store">
                <div className="hero-logo-frame">
                  <div className="hero-logo-halo" />
                  <img 
                    src="/onigashima_store_logo.avif" 
                    alt="Onigashima Store Official Logo" 
                    className="hero-emblem-img"
                    width="110"
                    height="110"
                    loading="eager"
                  />
                  <div className="hero-logo-corner top-left" aria-hidden="true" />
                  <div className="hero-logo-corner top-right" aria-hidden="true" />
                  <div className="hero-logo-corner bottom-left" aria-hidden="true" />
                  <div className="hero-logo-corner bottom-right" aria-hidden="true" />
                </div>
                <div className="hero-logo-subtag">
                  <span className="subtag-jp">鬼ヶ島</span>
                  <span className="subtag-dot" />
                  <span className="subtag-edition">Onigashima Store 2026</span>
                </div>
              </div>

              {/* Contenido Tipográfico */}
              <div className="hero-copy-block">
                <div className="showcase-headline">
                  <div className="headline-meta-row">
                    <span className="headline-meta">// TIENDA INTERNACIONAL</span>
                    <span className="headline-badge">EDICIÓN DE COLECCIÓN</span>
                  </div>

                  <h2 className="headline-title">
                    Figuras y productos de autor <span className="title-accent">oficiales premium</span>.
                  </h2>
                  <p className="headline-subtitle-desc">
                    Importación oficial de figuras y coleccionables exclusivos con envíos a todo el mundo.
                  </p>
                </div>
              </div>
            </div>

            {/* Barra de Navegación & Acciones Rápidas (Ubicada Arriba del Catálogo) */}
            <nav className="hero-top-nav-bar" aria-label="Navegación principal">
              <Link to="/catalog" className="nav-cta-primary">
                Ver Catálogo Completo &rarr;
              </Link>
              <div className="nav-secondary-links">
                <button 
                  onClick={() => openPanel('about')}
                  className={`nav-btn ${activePanelKey === 'about' ? 'active' : ''}`}
                >
                  Acerca de
                </button>
                <button 
                  onClick={() => openPanel('shipping')}
                  className={`nav-btn ${activePanelKey === 'shipping' ? 'active' : ''}`}
                >
                  Envíos & Sellos
                </button>
                <button 
                  onClick={() => openPanel('contact')}
                  className={`nav-btn ${activePanelKey === 'contact' ? 'active' : ''}`}
                >
                  Contacto
                </button>
              </div>
            </nav>

            {/* Zona con Corte Diagonal Técnico */}
            <div className="diagonal-showcase-zone">
              {/* Divisor Visual de Corte Diagonal */}
              <div className="diagonal-cut-edge" aria-hidden="true">
                <svg className="diagonal-cut-svg" viewBox="0 0 1200 22" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                      <stop offset="30%" stopColor="var(--color-accent)" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {/* Relleno inferior del corte diagonal que se funde con el fondo del carrusel */}
                  <polygon points="0,22 0,14 1200,2 1200,22" className="diagonal-svg-fill" />
                  {/* Línea inclinada con gradiente de luz neón */}
                  <line x1="0" y1="14" x2="1200" y2="2" stroke="url(#edgeGlow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {/* Contenedor del Carrusel integrado bajo el corte diagonal */}
              <div className="diagonal-shelf-body">
                <div 
                  className="hero-carousel-container"
                  onMouseEnter={() => setIsCarouselPaused(true)}
                  onMouseLeave={() => setIsCarouselPaused(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="carousel-top-bar">
                    <div className="carousel-label">
                      <span className="live-indicator" />
                      <span className="carousel-title-text">EXHIBICIÓN DROPS 2026</span>
                      <span className="carousel-count-tag">[{featuredProducts.length} PIEZAS]</span>
                    </div>

                    {/* HUD Central: Telemetría de Lotes & Timeline Progress */}
                    <div className="carousel-telemetry-hud">
                      <div className="carousel-batch-indicator">
                        <span className="batch-label">LOTE</span>
                        <span className="batch-numbers">
                          <strong className="batch-current">0{activeBatchIndex + 1}</strong>
                          <span className="batch-sep">/</span>
                          <span className="batch-total">0{productBatches.length}</span>
                        </span>
                      </div>

                      {/* Barra de progreso interactiva (Timeline) */}
                      <div 
                        className={`carousel-timeline-track ${isCarouselPaused ? 'paused' : ''}`}
                        title={isCarouselPaused ? "Pausa activa" : "Progreso de auto-avance"}
                      >
                        <div 
                          key={timelineKey}
                          className={`carousel-timeline-fill ${isCarouselPaused ? 'is-paused' : 'is-running'}`} 
                        />
                      </div>
                    </div>

                    {/* Controles de Lote Directos y Flechas */}
                    <div className="carousel-controls">
                      {/* Píldoras de selector de lote para salto instantáneo */}
                      <div className="carousel-batch-pills" role="tablist" aria-label="Seleccionar lote">
                        {productBatches.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            role="tab"
                            aria-selected={activeBatchIndex === idx}
                            aria-label={`Ir al lote ${idx + 1}`}
                            className={`batch-pill-btn ${activeBatchIndex === idx ? 'active' : ''}`}
                            onClick={() => goToBatch(idx)}
                          >
                            0{idx + 1}
                          </button>
                        ))}
                      </div>

                      <div className="carousel-nav-arrows">
                        <button 
                          type="button"
                          onClick={prevBatch} 
                          className="carousel-btn prev-btn" 
                          aria-label="Lote anterior"
                          title="Lote anterior"
                        >
                          &#8592;
                        </button>
                        <button 
                          type="button"
                          onClick={nextBatch} 
                          className="carousel-btn next-btn" 
                          aria-label="Lote siguiente"
                          title="Lote siguiente"
                        >
                          &#8594;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Viewport Confinado (Hermético dentro del marco) */}
                  <div className="carousel-viewport">
                    <div 
                      className="carousel-slider-track"
                      style={{ transform: `translateX(-${activeBatchIndex * 100}%)` }}
                    >
                      {productBatches.map((batch, batchIdx) => (
                        <div 
                          key={batchIdx} 
                          className="carousel-page-slide"
                          aria-hidden={activeBatchIndex !== batchIdx}
                        >
                          {batch.map((product) => (
                            <article key={product.id} className="carousel-card">
                              <Link to={`/catalog/${product.id}`} className="card-media-wrap">
                                <img 
                                  src={product.image_url} 
                                  alt={product.name} 
                                  loading="lazy" 
                                  className="card-thumb-img" 
                                />
                                <span className="card-badge-category">{product.category}</span>
                                {product.tags && product.tags[0] && (
                                  <span className="card-badge-tag">{product.tags[0]}</span>
                                )}
                              </Link>

                              <div className="card-details">
                                <Link to={`/catalog/${product.id}`} className="card-title-link">
                                  <h4 className="card-product-name">{product.name}</h4>
                                </Link>
                                
                                <div className="card-meta-row">
                                  <span className="card-price">${Number(product.price).toLocaleString('es-CL')}</span>
                                  <div className="card-stars">
                                    ★ {product.rating}
                                  </div>
                                </div>

                                <div className="card-actions-row">
                                  <button 
                                    className={`btn-quick-add ${addedItemNotice === product.id ? 'added' : ''}`}
                                    onClick={(e) => handleQuickAdd(product, e)}
                                    aria-label={`Añadir ${product.name} al carrito`}
                                  >
                                    {addedItemNotice === product.id ? '✓ Añadido' : '+ Añadir'}
                                  </button>
                                  <Link to={`/catalog/${product.id}`} className="btn-view-details">
                                    Ver
                                  </Link>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vértice Inferior: Marca de agua técnica */}
          <div className="frame-watermark">
            <span>ONIGASHIMA STORE® // TOKYO • SANTIAGO</span>
            <span className="watermark-sub">EDICIÓN LIMITADA & ONIGASHIMA STORE 2026</span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;

