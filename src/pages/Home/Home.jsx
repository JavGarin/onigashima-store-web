import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../../supabaseClient';
import { gsap } from 'gsap';
import './Home.css';
import videoBg from '../../assets/video/FLCL.webm';
import battle1Bg from '../../assets/video/battle1.webm';
import logoOnigashima from '../../assets/img/logoOnigashimaStore.svg';

const Home = () => {
  // Video Playlist Logic
  const videos = [videoBg, battle1Bg];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <>
    <div id="top"></div>
      <div className="hero-container" id="hero">
        <video 
          key={`main-${currentVideoIndex}`}
          src={videos[currentVideoIndex]} 
          autoPlay 
          muted 
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
