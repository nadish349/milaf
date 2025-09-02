import { useState, useEffect } from 'react';

export const useDevToolsDetection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    let devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;

    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          setIsDevToolsOpen(true);
          console.clear();
          console.log('%c🚫 Developer Tools Detected!', 'color: red; font-size: 20px; font-weight: bold;');
          console.log('%cThis website is protected. Please close developer tools to continue.', 'color: red; font-size: 14px;');
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          setIsDevToolsOpen(false);
        }
      }
    };

    // Method 1: Check window dimensions
    const checkDimensions = () => {
      detectDevTools();
    };

    // Method 2: Check console timing
    const checkConsole = () => {
      const start = performance.now();
      console.clear();
      console.log('%c', 'color: transparent;');
      const end = performance.now();
      
      if (end - start > 100) {
        setIsDevToolsOpen(true);
      }
    };

    // Method 3: Check for debugger statement
    const checkDebugger = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        setIsDevToolsOpen(true);
      }
    };

    // Method 4: Monitor console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    console.log = function(...args) {
      setIsDevToolsOpen(true);
      return originalLog.apply(console, args);
    };

    console.warn = function(...args) {
      setIsDevToolsOpen(true);
      return originalWarn.apply(console, args);
    };

    console.error = function(...args) {
      setIsDevToolsOpen(true);
      return originalError.apply(console, args);
    };

    console.info = function(...args) {
      setIsDevToolsOpen(true);
      return originalInfo.apply(console, args);
    };

    // Method 5: Check for common dev tools properties
    const checkDevToolsProperties = () => {
      if (
        (window as any).chrome?.runtime?.onConnect ||
        (window as any).chrome?.runtime?.onMessage ||
        (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ ||
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ) {
        setIsDevToolsOpen(true);
      }
    };

    // Method 6: Monitor for F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        setIsDevToolsOpen(true);
        return false;
      }
    };

    // Method 7: Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setIsDevToolsOpen(true);
      return false;
    };

    // Method 8: Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Method 9: Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    window.addEventListener('resize', checkDimensions);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Initial checks
    checkDimensions();
    checkDevToolsProperties();
    checkConsole();

    // Periodic checks
    const interval = setInterval(() => {
      checkDimensions();
      checkDevToolsProperties();
      checkConsole();
    }, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', checkDimensions);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      
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
