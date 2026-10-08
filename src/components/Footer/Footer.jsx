import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './Footer.css';
import githubIcon from '../../assets/img/githubwhite.svg';

gsap.registerPlugin(ScrollToPlugin);

const Footer = () => {
  const location = useLocation();
  const scrollToTopRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (location.pathname === '/') return;
    const scrollHandler = () => {
      if (!scrollToTopRef.current) return;
      if (window.scrollY > 200) {
        gsap.to(scrollToTopRef.current, { autoAlpha: 1, duration: 0.3 });
      } else {
        gsap.to(scrollToTopRef.current, { autoAlpha: 0, duration: 0.3 });
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/') return;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen, location.pathname]);

  const privacyPolicy = {
    title: 'Privacy Policy',
    content: (
      <>
        <p>At Onigashima Store, your privacy is our priority. We collect information to process your orders and improve your experience.</p>
        <p><strong>What information we collect:</strong> Name, address, email, and purchase history. We do not store credit card information.</p>
        <p><strong>How we use your information:</strong> To process and ship orders, communicate with you about your purchase, and, if you authorize it, send you special promotions about our anime figures and merchandise.</p>
        <p>We do not share your information with third parties, except with our shipping partners to deliver your products. Your passion for anime is safe with us!</p>
      </>
    )
  };

  const termsOfUse = {
    title: 'Terms of Use',
    content: (
      <>
        <p>Welcome to Onigashi Store. By using our site, you agree to the following conditions:</p>
        <p><strong>1. Site Usage:</strong> This site is for personal, non-commercial use. You may browse and purchase our anime products, from collectible figures to apparel and accessories.</p>
        <p><strong>2. Intellectual Property:</strong> All product images, characters, and logos are the property of their respective owners and are used for descriptive purposes. The design of our site is the property of Onigashima Store.</p>
        <p><strong>3. User Accounts:</strong> You are responsible for maintaining the confidentiality of your account and password. We reserve the right to terminate accounts if these terms are violated.</p>
        <p><strong>4. Pricing and Stock:</strong> We do our best to maintain the accuracy of prices and stock, but errors may occur. We reserve the right to cancel any order with incorrect information.</p>
      </>
    )
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleScrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' });
  };

  if (location.pathname === '/') {
    return null;
  }

  const FooterColumn = ({ id, title, children }) => {
    const isOpen = openSection === id;
    return (
      <div className="footer-column">
        <button
          className="footer-col-toggle"
          onClick={() => toggleSection(id)}
          aria-expanded={isOpen}
          aria-controls={"footer-col-" + id}
        >
          <h5>{title}</h5>
          <span className={"footer-chevron" + (isOpen ? " open" : "")} aria-hidden="true">&#8250;</span>
        </button>
        <div
          id={"footer-col-" + id}
          className={"footer-col-body" + (isOpen ? " open" : "")}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-main-content">
          <div className="footer-logo-column">
            <div className="footer-logo-wrapper">
              <div className="footer-logo-frame">
                <img src="/onigashima_store_logo.avif" alt="Onigashima Store Logo" className="footer-logo" />
              </div>
              <div className="footer-brand-meta">
                <p className="footer-logo-text">ONIGASHIMA</p>
                <span className="footer-logo-sub">ARCHIVE // TOKYO &bull; SANTIAGO</span>
              </div>
            </div>
            <p className="footer-tagline">Curaduria oficial de figuras japonesas, reliquias de coleccion y ediciones limitadas directamente desde Akihabara.</p>
          </div>

          <FooterColumn id="nav" title="Navigation">
            <Link to="/">Home</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/cart">Cart</Link>
          </FooterColumn>

          <FooterColumn id="support" title="Support">
            <a href="#">FAQ</a>
            <a href="#">Shipping &amp; Returns</a>
            <a href="#">Contact Us</a>
          </FooterColumn>

          <FooterColumn id="legal" title="Legal">
            <button className="footer-link-btn" onClick={() => openModal(privacyPolicy)}>Privacy Policy</button>
            <button className="footer-link-btn" onClick={() => openModal(termsOfUse)}>Terms of Use</button>
          </FooterColumn>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Onigashima Store. dev Javier Garin - All rights reserved.</p>
          <a href="https://github.com/JavGarin/onigashima-store-web" target="_blank" rel="noopener noreferrer" className="github-link-redesigned">
            <img src={githubIcon} alt="GitHub" />
            <span>View Project on GitHub</span>
          </a>
        </div>

        <div ref={scrollToTopRef} className="scroll-to-top" onClick={handleScrollToTop}>
          ^
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>{modalContent.title}</h2>
            <div>{modalContent.content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
