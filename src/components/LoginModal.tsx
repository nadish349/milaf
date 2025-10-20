import React from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useProductCart } from '@/contexts/ProductCartContext';
import { useBulkCart } from '@/contexts/BulkCartContext';

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
  const { mergeGuestCart } = useCart();
  const { mergeGuestCart: mergeProductGuestCart } = useProductCart();
  const { mergeGuestCart: mergeBulkGuestCart } = useBulkCart();

  const handleLoginSuccess = async () => {
    // Merge guest cart with user cart after successful login
    await mergeGuestCart();
    await mergeProductGuestCart();
    await mergeBulkGuestCart();
    onLoginSuccess?.();
    onClose();
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
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
};
