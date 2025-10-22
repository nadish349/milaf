import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) => {
  const location = useLocation();

  const handleLoginSuccess = () => {
    onLoginSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <LoginForm 
      isOpen={isOpen} 
      onClose={onClose} 
      onLoginSuccess={handleLoginSuccess} 
    />
  );
};
