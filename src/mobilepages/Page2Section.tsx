import React, { useState, useEffect, useRef } from "react";
import titledcolacandesign4 from "@/assets/titledcolacandesign4.png";
import tick from "@/assets/tick.png";
import goldenringWebm from "@/assets/goldenring.webm";
import goldenringMp4 from "@/assets/goldenring.mp4";
import about2frame from "@/assets/about2frame.png";

export const Page2Section = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Add user interaction handlers for mobile video playback
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      if (videoRef.current && showVideo) {
        videoRef.current.play().catch(console.error);
      }
    };

    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [showVideo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // User scrolled to this section - play video every time
          setShowVideo(true);
          setVideoError(false);
          setUserInteracted(false); // Reset user interaction state
          
          // Start video after a short delay - optimized for mobile
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              // Try to play the video
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log('Mobile video autoplay started successfully');
                    setUserInteracted(true);
                  })
                  .catch((error) => {
                    console.log('Mobile autoplay prevented:', error);
                    // Don't try to play again automatically - wait for user interaction
                  });
              }
            }
          }, 1000); // Increased delay for better mobile compatibility
        } else {
          // User scrolled away from section - reset video state
          setShowVideo(false);
          setVideoLoaded(false);
          setUserInteracted(false);
        }
      },
      { threshold: 0.3 } // Reduced threshold for earlier trigger
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoEnded = () => {
    setShowVideo(false);
    setVideoLoaded(false);
    // Reset to show image after video ends
    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Mobile video error:', e);
    setVideoError(true);
    setShowVideo(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundImage: `url(${about2frame})` }}
    >
      {/* Main title - visible and properly positioned */}
      <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-6 mt-8">
        Elevate your Refreshment
      </h1>

      {/* Cola image / video - moved above description */}
      <div className="w-44 h-44 sm:w-66 sm:h-66 mb-6 relative mt-8">
        {/* Image - shown initially and after video ends */}
        <img 
          src={titledcolacandesign4} 
          alt="Milaf Cola" 
          className={`w-full h-full object-contain transition-opacity duration-1000 ${
            showVideo ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video - shown only when scrolled to */}
        {showVideo && !videoError && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 80% at center, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 60%, transparent 100%)'
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
              autoPlay
              loop={false}
              preload="auto"
              onEnded={handleVideoEnded}
              onLoadedData={handleVideoLoad}
              onCanPlay={() => {
                // Ensure video can play on mobile
                if (videoRef.current && userInteracted) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onError={handleVideoError}
              onLoadStart={() => {
                console.log('Mobile video loading started');
              }}
              onPlay={() => {
                console.log('Mobile video started playing');
              }}
            >
              <source src={goldenringMp4} type="video/mp4" />
              <source src={goldenringWebm} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {/* Play button for mobile users */}
        {showVideo && !videoError && !userInteracted && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <button
              onClick={() => {
                setUserInteracted(true);
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-300"
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        )}
        
        {/* Fallback message for video errors */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <p className="text-white text-sm text-center">
              Video unavailable on this device
            </p>
          </div>
        )}
      </div>

      {/* Description - moved below the image */}
      <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl mb-4 text-left">
        Discover the first-ever date-based cola, with no added sugar.
      </p>
      <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl mb-6 text-left">
        Enjoy a unique, health-conscious refreshment, enriched with natural sweetness and nutrition.
      </p>

      {/* Big title */}
      <h2 className="text-lg sm:text-2xl md:text-3xl text-white font-semibold mb-6">
        SAUDI ARABIA&apos;S DATE BASED MILAF COLA
      </h2>

      {/* Features */}
      <div className="flex flex-col gap-4 text-white text-sm sm:text-base items-start max-w-md mx-auto mt-12 mb-20">
        <Feature icon={tick} text="Zero sugar" />
        <Feature icon={tick} text="Made in Saudi Arabia" />
        <Feature icon={tick} text="First ever Date-Based cola" />
      </div>
    </section>
  );
};

const Feature = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-2 justify-start w-full">
    <img src={icon} alt="" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
    <span>{text}</span>
  </div>
);
