import React, { useState, useEffect, useRef } from "react";
import titledcolacandesign4 from "@/assets/titledcolacandesign4.png";
import tick from "@/assets/tick.png";
import goldenring from "@/assets/goldenring.webm";
import about2frame from "@/assets/about2frame.png";

export const Page2Section = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          // User scrolled to this section and video hasn't played yet
          setShowVideo(true);
          setHasPlayed(true);
          
          // Start video after a short delay - optimized for mobile
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              // Try to play the video
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log('Video autoplay started successfully');
                  })
                  .catch((error) => {
                    console.log('Autoplay prevented:', error);
                    // If autoplay fails, try again after user interaction
                    const tryPlayAgain = () => {
                      videoRef.current?.play().catch(console.error);
                      document.removeEventListener('touchstart', tryPlayAgain);
                      document.removeEventListener('click', tryPlayAgain);
                    };
                    document.addEventListener('touchstart', tryPlayAgain, { once: true });
                    document.addEventListener('click', tryPlayAgain, { once: true });
                  });
              }
            }
          }, 800); // Increased delay for better mobile compatibility
        }
      },
      { threshold: 0.3 } // Reduced threshold for earlier trigger
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed]);

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
        {showVideo && (
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
              preload="metadata"
              onEnded={handleVideoEnded}
              onLoadedData={handleVideoLoad}
              onCanPlay={() => {
                // Ensure video can play on mobile
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setShowVideo(false);
              }}
              onLoadStart={() => {
                console.log('Video loading started');
              }}
              onPlay={() => {
                console.log('Video started playing');
              }}
            >
              <source src={goldenring} type="video/webm" />
              <source src={goldenring.replace('.webm', '.mp4')} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
