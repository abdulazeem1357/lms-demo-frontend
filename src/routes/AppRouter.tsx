import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute, AuthErrorHandler } from './guards';
import { publicRoutes, protectedRoutes } from './routes';
import { MainLayout } from '../components/layout/MainLayout';

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
          
          {/* Protected Routes - Wrapped with MainLayout for the mobile nav footer */}
          {protectedRoutes.map(({ path, element }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {element}
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
          ))}
        </Routes>
      </AnimatePresence>
    </AuthErrorHandler>
  );
};