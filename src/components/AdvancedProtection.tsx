import React, { useEffect, useState } from 'react';
import { useDevToolsDetection } from '@/hooks/useDevToolsDetection';

interface AdvancedProtectionProps {
  children: React.ReactNode;
}

export const AdvancedProtection: React.FC<AdvancedProtectionProps> = ({ children }) => {
  const isDevToolsOpen = useDevToolsDetection();
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    // Additional protection measures
    const protectPage = () => {
      // Disable common keyboard shortcuts
      const disableShortcuts = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+P
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
          (e.ctrlKey && ['U', 'S', 'A', 'P'].includes(e.key))
        ) {
          e.preventDefault();
          e.stopPropagation();
          setIsProtected(true);
          return false;
        }
      };

      // Disable right-click
      const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
        setIsProtected(true);
        return false;
      };

      // Disable text selection
      const disableSelection = (e: Event) => {
        e.preventDefault();
        return false;
      };

      // Disable drag and drop
      const disableDrag = (e: DragEvent) => {
        e.preventDefault();
        return false;
      };

      // Disable image dragging
      const disableImageDrag = (e: Event) => {
        e.preventDefault();
        return false;
      };

      // Add event listeners
      document.addEventListener('keydown', disableShortcuts, true);
      document.addEventListener('contextmenu', disableRightClick, true);
      document.addEventListener('selectstart', disableSelection, true);
      document.addEventListener('dragstart', disableDrag, true);
      document.addEventListener('drag', disableDrag, true);
      document.addEventListener('dragover', disableDrag, true);
      document.addEventListener('drop', disableDrag, true);

      // Disable image dragging
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('dragstart', disableImageDrag, true);
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
      });

      // Disable text selection on all elements
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';

      // Disable highlighting
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.khtmlUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      document.body.style.userSelect = 'none';

      // Cleanup function
      return () => {
        document.removeEventListener('keydown', disableShortcuts, true);
        document.removeEventListener('contextmenu', disableRightClick, true);
        document.removeEventListener('selectstart', disableSelection, true);
        document.removeEventListener('dragstart', disableDrag, true);
        document.removeEventListener('drag', disableDrag, true);
        document.removeEventListener('dragover', disableDrag, true);
        document.removeEventListener('drop', disableDrag, true);

        // Re-enable image dragging
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          img.removeEventListener('dragstart', disableImageDrag, true);
          img.style.pointerEvents = 'auto';
          img.style.userSelect = 'auto';
        });

        // Re-enable text selection
        document.body.style.userSelect = 'auto';
        document.body.style.webkitUserSelect = 'auto';
        document.body.style.mozUserSelect = 'auto';
        document.body.style.msUserSelect = 'auto';
        document.body.style.webkitTouchCallout = 'auto';
        document.body.style.khtmlUserSelect = 'auto';
      };
    };

    const cleanup = protectPage();
    return cleanup;
  }, []);

  // Show protection screen if dev tools are open or protection is triggered
  if (isDevToolsOpen || isProtected) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
        }}
      >
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '30px',
          animation: 'pulse 2s infinite'
        }}>
          🛡️
        </div>
        <h1 style={{ 
          fontSize: '36px', 
          marginBottom: '20px', 
          color: '#ff4444',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Security Protection Active
        </h1>
        <p style={{ 
          fontSize: '20px', 
          marginBottom: '30px', 
          maxWidth: '700px', 
          lineHeight: '1.6',
          color: '#cccccc'
        }}>
          This website is protected by advanced security measures. Developer tools and unauthorized access attempts have been detected.
        </p>
        <div style={{ 
          fontSize: '18px', 
          color: '#aaaaaa', 
          maxWidth: '600px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>To access this website:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <li>Close all developer tools (F12, Inspect Element)</li>
            <li>Disable any browser extensions that modify the page</li>
            <li>Refresh the page after closing developer tools</li>
            <li>Ensure you're not using any debugging tools</li>
          </ul>
        </div>
        <div style={{ 
          marginTop: '40px', 
          padding: '20px 40px', 
          backgroundColor: 'rgba(255,68,68,0.2)', 
          borderRadius: '10px',
          fontSize: '16px',
          color: '#ffaaaa',
          border: '1px solid rgba(255,68,68,0.3)'
        }}>
          <p style={{ margin: 0 }}>
            <strong>Note:</strong> This protection ensures the integrity and security of our application.
          </p>
        </div>
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
