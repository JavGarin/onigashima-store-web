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
    // Asegurar que el video se reproduzca al cambiar de fuente, redimensionar la ventana o salir de modo reposo
    const playVideo = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.log("Autoplay blocked or interrupted:", error);
        });
      }
    };

    playVideo();

    // Cuando el viewport cambia (ej. tablet), a veces el navegador pausa el video para ahorrar recursos.
    // Esto asegura que se siga reproduciendo sin que se vea afectado.
    window.addEventListener('resize', playVideo);
    window.addEventListener('orientationchange', playVideo);
    document.addEventListener('visibilitychange', playVideo);

    return () => {
      window.removeEventListener('resize', playVideo);
      window.removeEventListener('orientationchange', playVideo);
      document.removeEventListener('visibilitychange', playVideo);
    };
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
