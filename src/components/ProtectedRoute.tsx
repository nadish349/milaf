import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires authentication, if false, redirects if authenticated
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Dispatch login prompt event when user is not authenticated
  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      console.log('ProtectedRoute: User not authenticated, dispatching showLoginPrompt event');
      // Add a small delay to ensure the event is processed
      setTimeout(() => {
        console.log('ProtectedRoute: Dispatching showLoginPrompt event');
        window.dispatchEvent(new CustomEvent('showLoginPrompt'));
      }, 100);
    }
  }, [loading, requireAuth, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth) {
    // Route requires authentication
    if (!isAuthenticated) {
      // User is not authenticated, redirect to home
      return <Navigate to="/" replace />;
    }
    
    // User is authenticated, render the protected content
    return <>{children}</>;
  } else {
    // Route should redirect if user is authenticated (e.g., login page)
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    
    // User is not authenticated, render the content (e.g., login form)
    return <>{children}</>;
  }
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requireAuth: boolean = true
) => {
  return (props: P) => (
    <ProtectedRoute requireAuth={requireAuth}>
      <Component {...props} />
    </ProtectedRoute>
  );
};