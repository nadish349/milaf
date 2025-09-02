import { useState, useEffect } from 'react';

export const useDevToolsDetection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only monitor for F12 key press (dev tools shortcut)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        console.clear();
        console.log('%c🚫 Developer Tools Access Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cThis website is protected. Please close developer tools to continue.', 'color: red; font-size: 14px;');
        return false;
      }
    };

    // Monitor for actual inspect element usage (not just right-click)
    let isInspecting = false;
    let inspectTimeout: NodeJS.Timeout;

    const handleMouseOver = (e: MouseEvent) => {
      // Check if dev tools are open and user is hovering over elements
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        // Dev tools are likely open, check if user is actively inspecting
        const target = e.target as Element;
        if (target && target !== document.body && target !== document.documentElement) {
          isInspecting = true;
          clearTimeout(inspectTimeout);
          inspectTimeout = setTimeout(() => {
            if (isInspecting) {
              setIsDevToolsOpen(true);
              console.clear();
              console.log('%c🚫 Element Inspection Detected!', 'color: red; font-size: 20px; font-weight: bold;');
              console.log('%cThis website is protected. Please close developer tools to continue.', 'color: red; font-size: 14px;');
            }
          }, 1000); // Trigger after 1 second of hovering over elements
        }
      }
    };

    const handleMouseOut = () => {
      isInspecting = false;
      clearTimeout(inspectTimeout);
    };

    // Monitor for dev tools opening and element selection
    const checkDevToolsActivity = () => {
      const threshold = 200;
      const devToolsOpen = window.outerHeight - window.innerHeight > threshold || 
                          window.outerWidth - window.innerWidth > threshold;
      
      if (devToolsOpen) {
        // Dev tools are open, monitor for element inspection
        document.addEventListener('mouseover', handleMouseOver, true);
        document.addEventListener('mouseout', handleMouseOut, true);
      } else {
        // Dev tools closed, remove listeners
        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('mouseout', handleMouseOut, true);
        isInspecting = false;
        clearTimeout(inspectTimeout);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    
    // Check periodically for dev tools activity
    const interval = setInterval(checkDevToolsActivity, 500);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      clearTimeout(inspectTimeout);
      clearInterval(interval);
    };
  }, []);

  return isDevToolsOpen;
};
