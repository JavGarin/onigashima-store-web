import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './Footer.css';

gsap.registerPlugin(ScrollToPlugin);

const Footer = () => {
  const scrollToTopRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  // --- Fictitious Content ---
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

  // --- Modal Logic ---
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // --- Scroll to Top Logic ---
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 200) {
        gsap.to(scrollToTopRef.current, { autoAlpha: 1, duration: 0.3 });
      } else {
        gsap.to(scrollToTopRef.current, { autoAlpha: 0, duration: 0.3 });
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  const handleScrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Onigashima Store. All rights reserved.</p>
          <div className="footer-links">
            <span onClick={() => openModal(privacyPolicy)}>Privacy Policy</span>
            <span>|</span>
            <span onClick={() => openModal(termsOfUse)}>Terms of Use</span>
          </div>
          <a href="https://github.com/JavGarin/onigashima-store-web" target="_blank" rel="noopener noreferrer" className="github-link">
            <img src="/src/assets/img/githubwhite.png" alt="GitHub" />
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