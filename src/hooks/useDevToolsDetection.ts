import { useState, useEffect } from 'react';

export const useDevToolsDetection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only monitor for specific user actions that indicate dev tools access attempts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on F12 or dev tools shortcuts
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        console.clear();
        console.log('%c🚫 Developer Tools Access Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cThis website is protected. Please close developer tools to continue.', 'color: red; font-size: 14px;');
        return false;
      }
    };

    // Only trigger on right-click (inspect element attempt)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDevToolsOpen(true);
      console.clear();
      console.log('%c🚫 Right-Click Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
      console.log('%cThis website is protected. Please close developer tools to continue.', 'color: red; font-size: 14px;');
      return false;
    };

    // Add event listeners with capture to ensure they run first
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  return isDevToolsOpen;
};
