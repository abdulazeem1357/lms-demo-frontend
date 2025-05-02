import { apiClient } from '../api/client';
import { IUser } from '../types/user.types';

/**
 * Request payload for login.
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Response for successful login.
 */
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

/**
 * Request payload for registration.
 */
export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

/**
 * Response for successful registration.
 */
export interface IRegisterResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Request payload for password reset request.
 */
export interface IRequestPasswordReset {
  email: string;
}

/**
 * Request payload for resetting password.
 */
export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Login user and return tokens and user info.
 */
export async function login(payload: ILoginRequest): Promise<ILoginResponse> {
  const { data } = await apiClient.post<ILoginResponse>('/auth/login', payload);
  return data;
}

/**
 * Register a new user.
 */
export async function register(payload: IRegisterRequest): Promise<IRegisterResponse> {
  const { data } = await apiClient.post<IRegisterResponse>('/auth/register', payload);
  return data;
}

/**
 * Logout user (client-side: remove tokens, optionally notify backend).
 */
export async function logout(): Promise<void> {
  // Optionally call backend to invalidate refresh token
  await apiClient.post('/auth/logout');
  // Client-side token removal should be handled by AuthContext/store
}

/**
 * Request a password reset email.
 */
export async function requestPasswordReset(payload: IRequestPasswordReset): Promise<void> {
  await apiClient.post('/auth/request-password-reset', payload);
}

/**
 * Reset password using token from email.
 */
export async function resetPassword(payload: IResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/reset-password', payload);
}

/**
 * Refresh access token using refresh token.
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  const { data } = await apiClient.post<{ accessToken: string }>('/auth/refresh-token', { refreshToken });
  return data;
}
