import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setupAuthErrorHandler } from '../api/client';

/**
 * Protected route wrapper component
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

/**
 * Wrapper component that sets up auth error handling
 */
export const AuthErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  
  React.useEffect(() => {
    setupAuthErrorHandler(logout);
  }, [logout]);
  
  return <>{children}</>;
};