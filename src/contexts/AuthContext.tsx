import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { JWTService } from '@/services/jwtService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  jwtToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        // User is logged in, generate or refresh JWT token
        try {
          const token = await JWTService.generateToken(user.uid, user.email || '');
          JWTService.storeToken(token);
          setJwtToken(token);
        } catch (error) {
          console.error('Error generating JWT token:', error);
        }
      } else {
        // User is logged out, clear JWT token
        JWTService.removeToken();
        setJwtToken(null);
      }
      
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Clear JWT token first
      JWTService.removeToken();
      setJwtToken(null);
      
      // Then sign out from Firebase
      await signOut(auth);
      console.log('🔐 User logged out and JWT token cleared');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user is properly authenticated (both Firebase and JWT)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (user && jwtToken) {
        const currentUser = await JWTService.getCurrentUser();
        setIsAuthenticated(currentUser !== null);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [user, jwtToken]);

  const value = {
    user,
    loading,
    logout,
    isAuthenticated,
    jwtToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


