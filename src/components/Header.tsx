import { useState, useEffect } from "react";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show header after PAGE3.PNG transition completes (2.5s + 0.5s fade)

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-2 left-8 right-8 h-10 bg-white/30 backdrop-blur-sm rounded-[30px] border border-white/20 z-50 transition-opacity duration-500"
      style={{ borderRadius: '30px' }}
    >
      {/* Header content can be added here */}
    </div>
  );
};
