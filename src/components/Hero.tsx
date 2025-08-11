import { useState, useEffect } from "react";
import PAGE1Image from "@/assets/PAGE1.png";
import PAGE3Image from "@/assets/PAGE3.png";

export const Hero = () => {
  const [currentImage, setCurrentImage] = useState(PAGE1Image);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage(PAGE3Image);
        setIsTransitioning(false);
      }, 500); // Half second for fade out
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isTransitioning ? 0 : 1
        }}
      />
    </section>
  );
};