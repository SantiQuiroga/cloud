'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, type AuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthService } from '../services/authService';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    await AuthService.signInWithEmail(email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await AuthService.signUpWithEmail(email, password);
  };

  const signInWithGoogle = async () => {
    await AuthService.signInWithGoogle();
  };

  const signInWithFacebook = async () => {
    await AuthService.signInWithFacebook();
  };

  const signOut = async () => {
    await AuthService.signOut();
  };

  const linkProvider = async (provider: AuthProvider) => {
    await AuthService.linkProvider(provider);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    linkProvider,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
