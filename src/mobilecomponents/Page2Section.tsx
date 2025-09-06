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
  const [userInteracted, setUserInteracted] = useState(true); // Set to true for autoplay
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // iPhone specific: Initialize audio context for autoplay
  useEffect(() => {
    const isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIPhone) {
      // Create a temporary audio context to enable autoplay on iPhone
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (e) {
        console.log('Audio context creation failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // User scrolled to this section - play video every time
          setShowVideo(true);
          setVideoError(false);
          setUserInteracted(false); // Reset user interaction state
          
          // Check if iPhone for aggressive autoplay
          const isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);
          
          // Start video immediately for mobile autoplay
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              
              // iPhone specific: More aggressive play attempts
              const playVideo = () => {
                if (videoRef.current) {
                  videoRef.current.play().catch((error) => {
                    console.log('Video autoplay attempt:', error);
                    // iPhone: Try multiple times with different intervals
                    if (isIPhone) {
                      setTimeout(playVideo, 50); // Faster retry for iPhone
                    } else {
                      setTimeout(playVideo, 100);
                    }
                  });
                }
              };
              
              // iPhone: Try multiple play attempts immediately
              if (isIPhone) {
                playVideo();
                setTimeout(playVideo, 10);
                setTimeout(playVideo, 25);
                setTimeout(playVideo, 50);
              } else {
                playVideo();
              }
            }
          }, isIPhone ? 10 : 50); // Even faster for iPhone
        } else {
          // User scrolled away from section - reset video state
          setShowVideo(false);
          setVideoLoaded(false);
          // Keep userInteracted true for autoplay
        }
      },
      { 
        threshold: [0.1, 0.25, 0.5], // Multiple thresholds for earlier detection
        rootMargin: '50px 0px' // Start detecting 50px before section enters viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoEnded = () => {
    setShowVideo(false);
    setVideoLoaded(false);
    // Keep userInteracted true for autoplay
    // Reset to show image after video ends
    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Mobile video error:', e);
    setVideoError(true);
    setShowVideo(false);
  };

  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Mobile video started after user interaction');
            setUserInteracted(true);
          })
          .catch((error) => {
            console.error('Failed to play video after user interaction:', error);
          });
      }
    }
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
              webkit-playsinline="true"
              onEnded={handleVideoEnded}
              onLoadedData={() => {
                // Force play when data is loaded
                handleVideoLoad();
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onCanPlay={() => {
                // Force play video immediately when ready
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onLoadedMetadata={() => {
                // iPhone specific: try to play as soon as metadata is loaded
                if (videoRef.current) {
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
              onWaiting={() => {
                console.log('Mobile video waiting for data');
              }}
              onStalled={() => {
                console.log('Mobile video stalled');
              }}
            >
              <source src={goldenringWebm} type="video/webm" />
              <source src={goldenringMp4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Play button fallback - only show if video fails to autoplay */}
            {showVideo && !videoError && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <button
                  onClick={handlePlayButtonClick}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-300"
                  style={{ display: 'none' }} // Hidden by default, will show if needed
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Error message */}
            {videoError && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <p className="text-white text-sm text-center">
                  Video unavailable on this device
                </p>
              </div>
            )}
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
