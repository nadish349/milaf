import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BulkOrderPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ConfettiItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  emoji: string;
  animationDelay: number;
}

export const BulkOrderPopup: React.FC<BulkOrderPopupProps> = ({ isVisible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);

  // Debug: Log when popup visibility changes
  React.useEffect(() => {
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
        // Generate confetti items
        const confettiItems: ConfettiItem[] = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 20,
          rotation: Math.random() * 360,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)],
          emoji: ['✨', '🎉', '🎊', '🎈', '💫', '⭐', '🌟', '💎', '🎁', '🍀'][Math.floor(Math.random() * 10)],
          animationDelay: Math.random() * 0.5
        }));
        setConfetti(confettiItems);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Confetti Animation */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg)`,
            animationDelay: `${item.animationDelay}s`,
            animation: 'fallDown 2s ease-in forwards'
          }}
        >
          <span className="text-2xl" style={{ color: item.color }}>
            {item.emoji}
          </span>
        </div>
      ))}
      
      {/* Popup Content */}
      <div className={`relative bg-white rounded-xl shadow-2xl p-3 max-w-xs w-[85%] mx-4 transform transition-all duration-500 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Heading */}
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            ✨ SWEET FOR A REASON ✨
          </h2>
          
          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            <span className="font-bold">Are you a retailer?</span>
            <br />
            Bring your customers the natural goodness of Milaf Dates.
            <br />
            📦 Get in bulk today and share the sweetness of tradition!
          </p>
          
          {/* Call-to-action Button */}
          <button 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            onClick={() => {
              onClose();
              navigate('/bulk-order');
            }}
          >
            👉 Order in Bulk Now
          </button>
        </div>
      </div>


    </div>
  );
};
