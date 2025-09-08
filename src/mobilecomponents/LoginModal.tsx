import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

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
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { user } = useAuth();
  const { mergeGuestCart } = useCart();

  const handleLoginSuccess = async () => {
    // Merge guest cart with user cart after successful login
    await mergeGuestCart();
    onLoginSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {showLoginForm ? 'Sign In to Continue' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {showLoginForm ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 text-center text-sm">
                  You have items in your cart. Please sign in to proceed with checkout.
                </p>
              </div>
              
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowLoginForm(false)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 text-center text-sm">
                  Create an account to save your cart and proceed with checkout.
                </p>
              </div>
              
              {/* You can add a signup form here or redirect to signup */}
              <div className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Sign up functionality can be added here
                </p>
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
