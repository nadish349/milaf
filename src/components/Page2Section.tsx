import React, { useState, useEffect, useRef } from "react";
import milafcola from "@/assets/milafcola.png";
import tick from "@/assets/tick.png";
import goldenring from "@/assets/goldenring.webm";
import aboutframe1 from "@/assets/aboutframe1.png";

export const Page2Section = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Check if component is visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            // First time entering the page
            setIsVisible(true);
            setHasPlayed(false);
            // Start video sequence after 2 seconds
            const timer = setTimeout(() => {
              setShowVideo(true);
              if (videoRef.current) {
                videoRef.current.currentTime = 0; // Reset video to start
                videoRef.current.play();
              }
            }, 2000);
            
            return () => clearTimeout(timer);
          } else if (!hasPlayed) {
            // Coming back to the page, can play video again
            setHasPlayed(false);
            const timer = setTimeout(() => {
              setShowVideo(true);
              if (videoRef.current) {
                videoRef.current.currentTime = 0; // Reset video to start
                videoRef.current.play();
              }
            }, 2000);
            
            return () => clearTimeout(timer);
          }
        } else {
          // Page is not visible, reset states
          setIsVisible(false);
          setShowVideo(false);
          setVideoEnded(false);
        }
      },
      { threshold: 0.5 }
    );

    const currentElement = document.querySelector('[data-section="page2"]');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [isVisible, hasPlayed]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setHasPlayed(true);
    // Transition back to image after video ends
    setTimeout(() => {
      setShowVideo(false);
      setVideoEnded(false);
    }, 500);
  };

  return (
    <section 
      data-section="page2"
      className="relative min-h-screen w-full overflow-hidden snap-start snap-always bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${aboutframe1})`
      }}
    >
      
      {/* Background image - milafcola */}
      <div className={`absolute z-5 left-[100px] bottom-[100px] w-[400px] h-[400px] max-sm:left-[50px] max-sm:bottom-[60px] max-sm:w-[300px] max-sm:h-[300px] transition-opacity duration-1000 ${
        showVideo ? 'opacity-0' : 'opacity-100'
      }`}>
        <img
          src={milafcola}
          alt="Milaf Cola"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Video overlay */}
      <div className={`absolute z-5 left-[100px] bottom-[100px] w-[400px] h-[400px] max-sm:left-[50px] max-sm:bottom-[60px] max-sm:w-[300px] max-sm:h-[300px] transition-opacity duration-1000 ${
        showVideo ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onEnded={handleVideoEnded}
          muted
          preload="none"
        >
          <source src={goldenring} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Main title - "Elevate your Refreshment" */}
      <div className="absolute z-20 left-[calc(50%+10px)] sm:left-[calc(50%+10px)] md:left-[calc(50%+10px)] lg:left-[calc(50%+10px)] xl:left-[calc(50%+10px)] top-[60px] sm:top-[70px] md:top-[80px] lg:top-[90px] xl:top-[100px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[40px] max-sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight tracking-wide max-sm:text-lg max-sm:text-center">
          Elevate your Refreshment
        </h1>
      </div>
      
      {/* Description text */}
      <div className="absolute z-20 left-[calc(50%-40px)] sm:left-[calc(50%-40px)] md:left-[calc(50%-40px)] lg:left-[calc(50%-40px)] xl:left-[calc(50%-40px)] top-[200px] sm:top-[210px] md:top-[220px] lg:top-[230px] xl:top-[240px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[80px] max-sm:px-4">
        <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white leading-relaxed text-left max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] max-sm:text-xs max-sm:text-center max-sm:max-w-[280px]">
          <p>Discover the first-ever date-based cola, </p>
          <p>with no added sugar.Enjoy a unique,</p>
          <p>health-conscious refreshment,enriched</p>
          <p>with natural sweetness and nutrition.</p>
        </div>
      </div>
      
      {/* Large title - "SAUDI ARABIA'S DATE BASED MILAF COLA" */}
      <div className="absolute z-20 left-[calc(50%-40px)] sm:left-[calc(50%-40px)] md:left-[calc(50%-40px)] lg:left-[calc(50%-40px)] xl:left-[calc(50%-40px)] top-[360px] sm:top-[370px] md:top-[380px] lg:top-[390px] xl:top-[400px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[160px] max-sm:px-4">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-white leading-tight tracking-wide max-sm:text-xs max-sm:text-center">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-sm:text-sm">S</span>AUDI ARABIA'S DATE BASED MILAF COLA
        </h2>
      </div>
      
      {/* Feature groups with tick icons */}
      
      {/* Group 1: Zero sugar */}
      <div className="absolute z-20 left-[calc(50%-40px)] sm:left-[calc(50%-40px)] md:left-[calc(50%-40px)] lg:left-[calc(50%-40px)] xl:left-[calc(50%-40px)] top-[460px] sm:top-[470px] md:top-[480px] lg:top-[490px] xl:top-[500px] flex items-center max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[200px] max-sm:justify-center">
        <div className="w-[16px] sm:w-[20px] md:w-[24px] lg:w-[28px] xl:w-[32px] h-[16px] sm:h-[20px] md:h-[24px] lg:h-[28px] xl:h-[32px] mr-[10px] sm:mr-[12px] md:mr-[15px] lg:mr-[18px] xl:mr-[20px] max-sm:w-[12px] max-sm:h-[12px] max-sm:mr-[8px]">
          <img
            src={tick}
            alt="Tick icon"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-base text-white font-normal">
          Zero sugar
        </span>
      </div>
      
      {/* Group 2: Made in Saudi Arabia */}
      <div className="absolute z-20 left-[calc(50%-40px)] sm:left-[calc(50%-40px)] md:left-[calc(50%-40px)] lg:left-[calc(50%-40px)] xl:left-[calc(50%-40px)] top-[520px] sm:top-[530px] md:top-[540px] lg:top-[550px] xl:top-[560px] flex items-center max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[240px] max-sm:justify-center">
        <div className="w-[16px] sm:w-[20px] md:w-[24px] lg:w-[28px] xl:w-[32px] h-[16px] sm:h-[20px] md:h-[24px] lg:h-[28px] xl:h-[32px] mr-[10px] sm:mr-[12px] md:mr-[15px] lg:mr-[18px] xl:mr-[20px] max-sm:w-[12px] max-sm:h-[12px] max-sm:mr-[8px]">
          <img
            src={tick}
            alt="Tick icon"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-base text-white font-normal">
          Made in Saudi Arabia
        </span>
      </div>
      
      {/* Group 3: First ever Date-Based cola - Same line as Zero sugar */}
      <div className="absolute z-20 left-[calc(50%-40px)] sm:left-[calc(50%-40px)] md:left-[calc(50%-40px)] lg:left-[calc(50%-40px)] xl:left-[calc(50%-40px)] top-[460px] sm:top-[470px] md:top-[480px] lg:top-[490px] xl:top-[500px] flex items-center ml-[170px] sm:ml-[210px] md:ml-[250px] lg:ml-[290px] xl:ml-[330px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[200px] max-sm:ml-0 max-sm:justify-center">
        <div className="w-[16px] sm:w-[20px] md:w-[24px] lg:w-[28px] xl:w-[32px] h-[16px] sm:h-[20px] md:h-[24px] lg:h-[28px] xl:h-[32px] mr-[8px] sm:mr-[10px] md:mr-[12px] lg:mr-[15px] xl:mr-[18px] max-sm:w-[12px] max-sm:h-[12px] max-sm:mr-[6px]">
          <img
            src={tick}
            alt="Tick icon"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-base text-white font-normal">
          First ever Date-Based cola
        </span>
      </div>
    </section>
  );
};
