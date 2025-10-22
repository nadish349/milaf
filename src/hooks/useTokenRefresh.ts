import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { JWTService } from '@/services/jwtService';

/**
 * Hook to automatically refresh JWT tokens when they're close to expiring
 * This ensures users stay logged in without interruption
 */
export const useTokenRefresh = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    // Check token refresh every 30 minutes
    const refreshInterval = setInterval(async () => {
      if (user && user.email) {
        const refreshedToken = await JWTService.refreshTokenIfNeeded(user.uid, user.email);
        if (refreshedToken) {
          console.log('🔄 JWT token refreshed automatically');
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Also check immediately on mount
    const checkRefresh = async () => {
      if (user && user.email) {
        const refreshedToken = await JWTService.refreshTokenIfNeeded(user.uid, user.email);
        if (refreshedToken) {
          console.log('🔄 JWT token refreshed on mount');
        }
      }
    };
    
    checkRefresh();

    return () => {
      clearInterval(refreshInterval);
    };
  }, [user, isAuthenticated]);

  return null;
};
