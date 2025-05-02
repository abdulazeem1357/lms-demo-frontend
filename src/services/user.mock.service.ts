import usersRaw from '../../mocks/users.mock.json';
import { IUser, IUserListResponse, IRole } from '../types/user.types';

// Helper to cast role to IUser["role"]
function mapUserRole(user: any): IUser {
  return {
    ...user,
    role: user.role as IUser['role'],
  };
}

/**
 * Fetches the current authenticated user's profile (mock: returns first user).
 */
export async function getCurrentUserProfile(): Promise<IUser> {
  return Promise.resolve(mapUserRole(usersRaw[0]));
}

/**
 * Updates the current user's profile (mock: merges with first user).
 */
export async function updateUserProfile(profile: Partial<Pick<IUser, 'firstName' | 'lastName' | 'username'>>): Promise<IUser> {
  return Promise.resolve({ ...mapUserRole(usersRaw[0]), ...profile });
}

/**
 * Changes the current user's password (mock: no-op).
 */
export async function changePassword(): Promise<void> {
  return Promise.resolve();
}

/**
 * Fetches a user by ID (mock).
 */
export async function getUserById(userId: string): Promise<IUser> {
  const user = usersRaw.find((u: any) => u.id === userId);
  if (!user) throw new Error('User not found');
  return Promise.resolve(mapUserRole(user));
}

/**
 * Fetches a paginated list of users (mock: returns all users, ignores params).
 */
export async function getUsers(): Promise<IUserListResponse> {
  const mapped = usersRaw.map(mapUserRole);
  return Promise.resolve({
    data: mapped,
    meta: {
      page: 1,
      limit: mapped.length,
      totalItems: mapped.length,
      totalPages: 1,
    },
  });
}

/**
 * Fetches roles assigned to a user (mock: returns role from user object).
 */
export async function getUserRoles(userId: string): Promise<IRole[]> {
  const user = usersRaw.find((u: any) => u.id === userId);
  if (!user) return Promise.resolve([]);
  return Promise.resolve([
    { id: user.id, name: user.role as IRole['name'] }
  ]);
}

/**
 * Assigns a role to a user (mock: no-op).
 */
export async function assignUserRole(): Promise<void> {
  return Promise.resolve();
}

/**
 * Removes a role from a user (mock: no-op).
 */
export async function removeUserRole(): Promise<void> {
  return Promise.resolve();
}
