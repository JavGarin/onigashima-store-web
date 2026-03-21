import React, { useState, useEffect } from 'react';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import './Home.css';
import videoBg from '../../assets/video/FLCL.webm';
import battle1Bg from '../../assets/video/battle1.webm';
import logoOnigashima from '../../assets/img/logoOnigashimaStore.svg';

const videos = [videoBg, battle1Bg];

const Home = () => {
  // Video Playlist Logic
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Asegurar que el video se reproduzca al cambiar de fuente o redimensionar
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay blocked or interrupted:", error);
      });
    }
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <>
    <div id="top"></div>
      <div className="hero-container" id="hero">
        <video 
          ref={videoRef}
          src={videos[currentVideoIndex]} 
          autoPlay 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={handleVideoEnd}
        />
        <img src={logoOnigashima} alt="Onigashima Store Logo" className="hero-logo" />
        <div className="hero-content">
          <h1>Onigashima Store</h1>
          <p>Your universe of anime collectibles</p>
        </div>
      </div>
    </>
  );
};

export default Home;
