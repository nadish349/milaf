import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { showAddToCartSuccess, showCartError } from '@/controllers/CartNotificationController';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) => {
  const { user } = useAuth();
  const [isMergingCart, setIsMergingCart] = useState(false);

  const handleLoginSuccess = async () => {
    try {
      onLoginSuccess?.();
      onClose();
    } catch (error) {
      console.error('❌ LoginModal: Error during login:', error);
      showCartError("Login failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isMergingCart ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-center">
                Transferring your cart items...
              </p>
            </div>
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
