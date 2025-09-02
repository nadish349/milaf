import React from 'react';
import { useDevToolsDetection } from '@/hooks/useDevToolsDetection';

interface DevToolsProtectionProps {
  children: React.ReactNode;
}

export const DevToolsProtection: React.FC<DevToolsProtectionProps> = ({ children }) => {
  const isDevToolsOpen = useDevToolsDetection();

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
          boxSizing: 'border-box'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</div>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#ff4444' }}>
          Access Denied
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', maxWidth: '600px', lineHeight: '1.6' }}>
          Developer tools have been detected. This website is protected and cannot be accessed while developer tools are open.
        </p>
        <div style={{ fontSize: '16px', color: '#cccccc', maxWidth: '500px' }}>
          <p>Please close your browser's developer tools to continue:</p>
          <ul style={{ textAlign: 'left', marginTop: '15px' }}>
            <li>Press <strong>F12</strong> to close developer tools</li>
            <li>Or press <strong>Ctrl+Shift+I</strong> (Windows/Linux)</li>
            <li>Or press <strong>Cmd+Option+I</strong> (Mac)</li>
            <li>Or right-click and select "Inspect" to close</li>
          </ul>
        </div>
        <div style={{ 
          marginTop: '40px', 
          padding: '15px 30px', 
          backgroundColor: '#333333', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#aaaaaa'
        }}>
          <p>This protection is in place to maintain the integrity of our application.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
