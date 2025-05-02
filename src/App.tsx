import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { setupAuthErrorHandler } from './api/client'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/common/PageTransition'

// Import your actual pages here
// import DashboardPage from './pages/DashboardPage'
// import CoursesPage from './pages/CoursesPage'
// import ProfilePage from './pages/ProfilePage'
// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'

// Temporarily using placeholder components for the demo
const DashboardPage = () => <div className="p-8">Dashboard Page</div>
const CoursesPage = () => <div className="p-8">Courses Page</div>
const ProfilePage = () => <div className="p-8">Profile Page</div>
const LoginPage = () => <div className="p-8">Login Page</div>
const RegisterPage = () => <div className="p-8">Register Page</div>

/**
 * Protected route wrapper component
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
const AuthErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  
  // Set up the API client auth error handler with the logout function
  React.useEffect(() => {
    setupAuthErrorHandler(logout);
  }, [logout]);
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AuthErrorHandler>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/login" 
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CoursesPage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AnimatePresence>
    </AuthErrorHandler>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;