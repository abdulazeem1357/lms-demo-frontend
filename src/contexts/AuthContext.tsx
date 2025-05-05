import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../types/user.types';
import { apiClient } from '../api/client';

// Auth service response types
interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

interface ILoginRequest {
  username: string;
  password: string;
}

interface IRegisterRequest extends Omit<IUser, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {
  password: string;
}

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: ILoginRequest) => Promise<void>;
  register: (userData: IRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  devLogin: () => Promise<void>; // Added development login without credentials
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Sets the auth token in localStorage.
 * @param token The JWT access token to store.
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

// Mock dummy user for development - Use the ID from users.mock.json
const DUMMY_USER: IUser = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // <-- Use the ID from mock files
  username: 'alice_student',                  // <-- Use username from mock files
  email: 'alice.student@lms-example.com',     // <-- Use email from mock files
  firstName: 'Alice',                         // <-- Use firstName from mock files
  lastName: 'Wonder',                         // <-- Use lastName from mock files
  role: 'Student',
  isActive: true,
  createdAt: '2025-05-01T10:00:00Z', // Use consistent date if needed
  updatedAt: '2025-05-01T10:00:00Z'  // Use consistent date if needed
};

// Mock auth service functions - replace with real API calls
const login = async (credentials: ILoginRequest): Promise<IAuthResponse> => {
  const response = await apiClient.post<IAuthResponse>('/auth/login', credentials);
  return response.data;
};

const register = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  const response = await apiClient.post<IAuthResponse>('/auth/register', userData);
  return response.data;
};

const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Auth provider component that manages authentication state and operations.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing token and restore user session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // When restoring session, use the DUMMY_USER data for consistent mock data
          setUser(DUMMY_USER);
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Development-only login that bypasses API calls
   * Sets a dummy user and token for testing purposes
   */
  const handleDevLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set dummy token and user
      const dummyToken = 'dev-token-' + Math.random().toString(36).substring(2);
      setAuthToken(dummyToken);
      setUser(DUMMY_USER);
      navigate('/dashboard');
    } catch (err) {
      setError('Development login failed');
      console.error('Dev login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Authenticate user with credentials
   */
  const handleLogin = useCallback(async (credentials: ILoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await login(credentials);
      setAuthToken(response.accessToken);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Register a new user
   */
  const handleRegister = useCallback(async (userData: IRegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await register(userData);
      setAuthToken(response.accessToken);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Logout the current user
   */
  const handleLogout = useCallback(async () => {
    try {
      // For dev mode, just clear local state without API call
      const isDevelopment = true; // Set this based on environment if needed
      
      if (!isDevelopment) {
        await logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthToken(null);
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    devLogin: handleDevLogin, // Expose the development login function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook for accessing the auth context.
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}