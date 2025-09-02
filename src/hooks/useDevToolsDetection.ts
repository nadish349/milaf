import { useState, useEffect } from 'react';

export const useDevToolsDetection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Store original console methods first
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    // Method 1: Block F12 key (intentional dev tools access)
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

    // Method 2: Block right-click context menu (inspect element attempt)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDevToolsOpen(true);
      console.clear();
      originalLog.call(console, '%c🚫 Right-Click Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
      return false;
    };

    // Method 3: Block common dev tools shortcuts (intentional access)
    const handleKeyCombo = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I (Inspect Element)
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J (Console)
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C (Select Element)
        (e.ctrlKey && e.key === 'U') // Ctrl+U (View Source)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Dev Tools Shortcut Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
        return false;
      }
    };

    // Method 4: Detect intentional console usage (not background)
    let consoleUsageCount = 0;
    let consoleUsageTimeout: NodeJS.Timeout;

    console.log = function(...args) {
      consoleUsageCount++;
      if (consoleUsageCount > 2) { // Only trigger after multiple console uses
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
      return originalLog.apply(console, args);
    };

    console.warn = function(...args) {
      consoleUsageCount++;
      if (consoleUsageCount > 2) {
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
      return originalWarn.apply(console, args);
    };

    console.error = function(...args) {
      consoleUsageCount++;
      if (consoleUsageCount > 2) {
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
      return originalError.apply(console, args);
    };

    console.info = function(...args) {
      consoleUsageCount++;
      if (consoleUsageCount > 2) {
        setIsDevToolsOpen(true);
        console.clear();
        originalLog.call(console, '%c🚫 Console Usage Detected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
      return originalInfo.apply(console, args);
    };

    // Reset console usage count periodically
    const resetConsoleCount = () => {
      consoleUsageCount = 0;
    };

    // Add event listeners for intentional actions only
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyCombo, true);
    
    // Reset console count every 5 seconds
    const consoleResetInterval = setInterval(resetConsoleCount, 5000);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyCombo, true);
      
      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      
      clearInterval(consoleResetInterval);
      clearTimeout(consoleUsageTimeout);
    };
  }, []);

  return isDevToolsOpen;
};
