import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getFeaturedProducts } from '../../data/mockProducts';
import './Home.css';
import videoBg from '../../assets/video/FLCL.webm';
import battle1Bg from '../../assets/video/battle1.webm';
import logoOnigashima from '../../assets/img/logoOnigashimaStore.svg';

const videos = [videoBg, battle1Bg];

const Home = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const carouselTrackRef = useRef(null);

  // Cart & Auth Contexts
  const { cartCount, addToCart } = useCart();
  const { user } = useAuth();

  // Floating Panel Drawer State
  const [activePanelKey, setActivePanelKey] = useState(null);
  const [panelContent, setPanelContent] = useState({ title: '', body: '' });

  // Carousel State & Products
  const featuredProducts = getFeaturedProducts(6);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Predefined panel details
  const panelsData = {
    about: {
      title: 'Acerca de Onigashima',
      body: 'Onigashima Store es un espacio de curaduría dedicado a coleccionistas exigentes. Cada figura y reliquia es importada directamente desde Akihabara y los estudios de animación más prestigiosos de Japón, garantizando sellos de autenticidad TOEI, Kotobukiya, Bandai Spirits y Good Smile Company.'
    },
    shipping: {
      title: 'Autenticidad & Envíos',
      body: 'Empacamos cada pieza con protección de grado coleccionista (cajas dobles de alto impacto y sellado hidrófugo). Envíos exprés nacionales e internacionales con número de rastreo prioritario y seguro contra daños al 100% del valor declarado.'
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

  // Carousel Controls
  const scrollCarousel = (direction) => {
    if (!carouselTrackRef.current) return;
    const scrollAmount = 300;
    carouselTrackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
    
    if (direction === 'next') {
      setActiveCardIndex((prev) => Math.min(prev + 1, featuredProducts.length - 1));
    } else {
      setActiveCardIndex((prev) => Math.max(prev - 1, 0));
    }
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
                <img src={logoOnigashima} alt="Onigashima Store Logo" className="brand-logo-img" />
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

          {/* Área Central: Hero Statement & Carrusel con Corte Diagonal */}
          <section className="hero-center-showcase">
            <div className="showcase-headline">
              <span className="headline-meta">// CURATED JAPANESE DROPS</span>
              <h2 className="headline-title">
                Autenticidad pura traída desde <span className="title-accent">Akihabara</span>.
              </h2>
            </div>

            {/* Zona con Corte Diagonal Técnico */}
            <div className="diagonal-showcase-zone">
              {/* Divisor Visual de Corte Diagonal */}
              <div className="diagonal-cut-edge" aria-hidden="true">
                <svg className="diagonal-cut-svg" viewBox="0 0 1200 36" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                      <stop offset="30%" stopColor="var(--color-accent)" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {/* Relleno inferior del corte diagonal que se funde con el fondo del carrusel */}
                  <polygon points="0,36 0,26 1200,4 1200,36" className="diagonal-svg-fill" />
                  {/* Línea inclinada con gradiente de luz neón */}
                  <line x1="0" y1="26" x2="1200" y2="4" stroke="url(#edgeGlow)" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {/* Contenedor del Carrusel integrado bajo el corte diagonal */}
              <div className="diagonal-shelf-body">
                <div className="hero-carousel-container">
                  <div className="carousel-top-bar">
                    <div className="carousel-label">
                      <span className="live-indicator" />
                      <span>Destacados en Exhibición ({featuredProducts.length})</span>
                    </div>
                    <div className="carousel-controls">
                      <button 
                        onClick={() => scrollCarousel('prev')} 
                        className="carousel-btn prev-btn" 
                        aria-label="Figura anterior"
                      >
                        &#8592;
                      </button>
                      <button 
                        onClick={() => scrollCarousel('next')} 
                        className="carousel-btn next-btn" 
                        aria-label="Figura siguiente"
                      >
                        &#8594;
                      </button>
                    </div>
                  </div>

                  <div className="carousel-track" ref={carouselTrackRef}>
                    {featuredProducts.map((product) => (
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
                            <span className="card-price">${product.price}</span>
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
                </div>
              </div>
            </div>
          </section>

          {/* Vértice Inferior Izquierdo: Marca de agua técnica */}
          <div className="frame-watermark">
            <span>ONIGASHIMA STORE® // TOKYO • SANTIAGO</span>
            <span className="watermark-sub">EDICIÓN LIMITADA & ARCHIVO OFICIAL 2026</span>
          </div>

          {/* Vértice Inferior Derecho: CTAs / Navegación */}
          <nav className="frame-nav" aria-label="Navegación principal">
            <Link to="/catalog" className="nav-cta-primary">
              Ver Catálogo Completo &rarr;
            </Link>
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
          </nav>

        </div>
      </main>
    </div>
  );
};

export default Home;

