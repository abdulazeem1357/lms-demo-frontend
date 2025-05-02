import { apiClient } from '../api/client';
import {
  IUser,
  IUserListResponse,
  IUserDetailResponse,
  IUserRolesResponse,
  IUserAssignRoleRequest,
  IRole,
  IPagination
} from '../types/user.types';

/**
 * Fetches the current authenticated user's profile.
 */
export async function getCurrentUserProfile(): Promise<IUser> {
  const { data } = await apiClient.get<IUserDetailResponse>('/users/me');
  return data.data;
}

/**
 * Updates the current user's profile.
 * @param profile Partial user fields to update (firstName, lastName, etc.)
 */
export async function updateUserProfile(profile: Partial<Pick<IUser, 'firstName' | 'lastName' | 'username'>>): Promise<IUser> {
  const { data } = await apiClient.put<IUserDetailResponse>('/users/me', profile);
  return data.data;
}

/**
 * Changes the current user's password.
 * @param currentPassword The user's current password
 * @param newPassword The new password to set
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/users/me/change-password', { currentPassword, newPassword });
}

/**
 * Fetches a user by ID (admin/instructor only).
 */
export async function getUserById(userId: string): Promise<IUser> {
  const { data } = await apiClient.get<IUserDetailResponse>(`/users/${userId}`);
  return data.data;
}

/**
 * Fetches a paginated list of users (admin only).
 */
export async function getUsers(params?: Partial<Pick<IPagination, 'page' | 'limit'>> & { search?: string; role?: string }): Promise<IUserListResponse> {
  const { data } = await apiClient.get<IUserListResponse>('/users', { params });
  return data;
}

/**
 * Fetches roles assigned to a user.
 */
export async function getUserRoles(userId: string): Promise<IRole[]> {
  const { data } = await apiClient.get<IUserRolesResponse>(`/users/${userId}/roles`);
  return data.data;
}

/**
 * Assigns a role to a user.
 */
export async function assignUserRole(userId: string, roleId: string): Promise<void> {
  await apiClient.post(`/users/${userId}/roles`, { roleId } as IUserAssignRoleRequest);
}

/**
 * Removes a role from a user.
 */
export async function removeUserRole(userId: string, roleId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/roles/${roleId}`);
}
