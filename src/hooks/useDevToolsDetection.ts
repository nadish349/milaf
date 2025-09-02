import { useState, useEffect } from 'react';

export const useDevToolsDetection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Store original console methods first
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    // Method 1: Block F12 key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 F12 Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
        return false;
      }
    };

    // Method 2: Block right-click context menu (inspect element)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDevToolsOpen(true);
              console.clear();
        originalLog.call(console, '%c🚫 Right-Click Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
      return false;
    };

    // Method 3: Block common dev tools shortcuts
    const handleKeyCombo = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
        (e.ctrlKey && e.key === 'U') // Ctrl+U (view source)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Dev Tools Shortcut Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
        return false;
      }
    };

    // Method 4: Detect dev tools by window size changes
    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Developer Tools Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
    };

    // Method 5: Detect console usage

    console.log = function(...args) {
      setIsDevToolsOpen(true);
      console.clear();
      originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      return originalLog.apply(console, args);
    };

    console.warn = function(...args) {
      setIsDevToolsOpen(true);
      console.clear();
      originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      return originalWarn.apply(console, args);
    };

    console.error = function(...args) {
      setIsDevToolsOpen(true);
      console.clear();
      originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      return originalError.apply(console, args);
    };

    console.info = function(...args) {
      setIsDevToolsOpen(true);
      console.clear();
      originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      return originalInfo.apply(console, args);
    };

    // Method 6: Detect debugger usage
    const checkDebugger = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Debugger Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
    };

    // Add all event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyCombo, true);
    window.addEventListener('resize', checkDevTools);
    
    // Initial checks
    checkDevTools();
    checkDebugger();

    // Periodic checks
    const interval = setInterval(() => {
      checkDevTools();
      checkDebugger();
    }, 1000);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyCombo, true);
      window.removeEventListener('resize', checkDevTools);
      
      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      
      clearInterval(interval);
    };
  }, []);

  return isDevToolsOpen;
};
