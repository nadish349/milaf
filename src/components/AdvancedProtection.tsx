import React from 'react';
import { useDevToolsDetection } from '@/hooks/useDevToolsDetection';

interface AdvancedProtectionProps {
  children: React.ReactNode;
}

export const AdvancedProtection: React.FC<AdvancedProtectionProps> = ({ children }) => {
  const isDevToolsOpen = useDevToolsDetection();

  // Show protection screen only when dev tools access is attempted
  if (isDevToolsOpen) {
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
           Developer Tools Access Blocked
         </h1>
         <p style={{ 
           fontSize: '20px', 
           marginBottom: '30px', 
           maxWidth: '700px', 
           lineHeight: '1.6',
           color: '#cccccc'
         }}>
           You attempted to access developer tools (F12, inspect element, or console usage). This website is protected and blocks such access attempts.
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
                     <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>To continue using this website:</p>
           <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
             <li>Do not press F12 or use dev tools shortcuts</li>
             <li>Do not select "Inspect Element" from right-click menu</li>
             <li>Do not use the browser console</li>
             <li>Refresh the page to continue normal browsing</li>
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
             <strong>Note:</strong> This protection only activates when you intentionally try to access developer tools.
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
