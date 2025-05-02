import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TApiErrorResponse } from '../types/api.types';

/**
 * Retrieves the current auth token from localStorage.
 * @returns {string | null} The JWT access token, or null if not found.
 * @remarks
 * For enhanced security, consider migrating to HttpOnly cookies.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Axios instance for LMS API requests.
 * - Sets base URL from Vite env.
 * - Adds Authorization header if token is present.
 * - Handles 401 errors globally (see logout integration).
 *
 * @see https://axios-http.com/docs/instance
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Variable to prevent multiple 401 handlers from executing simultaneously
let isRefreshing = false;

/**
 * Handle authentication errors (401) by logging out the user.
 * This function must be called once the auth context is available.
 * 
 * @param logoutFn - The logout function from AuthContext
 */
export const setupAuthErrorHandler = (logoutFn: () => Promise<void>): void => {
  apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError<TApiErrorResponse>) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !isRefreshing) {
        isRefreshing = true;
        
        console.error('Authentication error: Session expired or invalid token');
        
        // Use the logout function from AuthContext
        logoutFn()
          .catch(err => {
            console.error('Error during logout:', err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
      
      // Network errors
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        console.error('Network error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
};

// Security Note: Prefer HttpOnly cookies for token storage in production environments.
