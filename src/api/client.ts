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
 * - Handles 401 errors globally (see TODO for logout integration).
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

apiClient.interceptors.response.use(
  res => res,
  (error: AxiosError<TApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // TODO: Integrate with AuthContext to trigger logout and redirect to login page
      // Example: authContext.logout();
    }
    return Promise.reject(error);
  }
);

// Security Note: Prefer HttpOnly cookies for token storage in production environments.
