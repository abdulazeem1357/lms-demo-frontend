import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute, AuthErrorHandler } from './guards';
import { publicRoutes, protectedRoutes } from './routes';

/**
 * Main router component that handles route configuration and animation
 */
export const AppRouter: React.FC = () => {
  const location = useLocation();
  
  return (
    <AuthErrorHandler>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          
          {/* Protected Routes */}
          {protectedRoutes.map(({ path, element }) => (
            <Route 
              key={path} 
              path={path} 
              element={<ProtectedRoute>{element}</ProtectedRoute>} 
            />
          ))}
        </Routes>
      </AnimatePresence>
    </AuthErrorHandler>
  );
};