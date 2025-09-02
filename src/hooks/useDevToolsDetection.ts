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

    // Method 2: Detect when user tries to select "Inspect Element" from context menu
    let contextMenuShown = false;
    let inspectElementAttempted = false;

    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu to show, but track it
      contextMenuShown = true;
      
      // Set a timeout to reset the flag if no inspect element is selected
      setTimeout(() => {
        if (!inspectElementAttempted) {
          contextMenuShown = false;
        }
      }, 2000); // 2 second window to detect inspect element selection
    };

    // Method 2b: Detect when user actually tries to inspect element
    const handleKeyDownAfterContextMenu = (e: KeyboardEvent) => {
      // If context menu was shown and user presses Enter or clicks, they might be selecting inspect
      if (contextMenuShown && (e.key === 'Enter' || e.key === ' ')) {
        // Check if dev tools would open (this is a heuristic)
        setTimeout(() => {
          const widthDiff = window.outerWidth - window.innerWidth;
          const heightDiff = window.outerHeight - window.innerHeight;
          if (widthDiff > 100 || heightDiff > 100) {
            inspectElementAttempted = true;
            setIsDevToolsOpen(true);
            console.clear();
            originalLog.call(console, '%c🚫 Inspect Element Blocked!', 'color: red; font-size: 20px; font-weight: bold;');
          }
        }, 100);
      }
    };

    // Method 2c: Detect dev tools opening after context menu
    const checkDevToolsAfterContextMenu = () => {
      if (contextMenuShown) {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > 100 || heightDiff > 100) {
          inspectElementAttempted = true;
          setIsDevToolsOpen(true);
          console.clear();
          originalLog.call(console, '%c🚫 Inspect Element Detected!', 'color: red; font-size: 20px; font-weight: bold;');
        }
      }
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
    document.addEventListener('keydown', handleKeyDownAfterContextMenu, true);
    
    // Monitor for dev tools opening after context menu
    const contextMenuInterval = setInterval(checkDevToolsAfterContextMenu, 500);
    
    // Reset console count every 5 seconds
    const consoleResetInterval = setInterval(resetConsoleCount, 5000);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyCombo, true);
      document.removeEventListener('keydown', handleKeyDownAfterContextMenu, true);
      
      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      
      clearInterval(consoleResetInterval);
      clearInterval(contextMenuInterval);
      clearTimeout(consoleUsageTimeout);
    };
  }, []);

  return isDevToolsOpen;
};
