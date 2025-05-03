import {
  IUser,
  IUserListResponse,
  IRole,
  IPagination
} from '../types/user.types';

// Mock user data with correct role types
const mockUsers = [
  {
    id: 'usr-001',
    username: 'jsmith',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'Student' as const,
    isActive: true,
    createdAt: '2024-10-15T08:30:00Z',
    updatedAt: '2025-03-22T14:15:00Z'
  },
  {
    id: 'usr-002',
    username: 'sarahjones',
    email: 'sarah.jones@example.com',
    firstName: 'Sarah',
    lastName: 'Jones',
    role: 'Student' as const,
    isActive: true,
    createdAt: '2024-11-05T10:20:00Z',
    updatedAt: '2025-02-18T09:45:00Z'
  },
  {
    id: 'usr-003',
    username: 'mwilliams',
    email: 'mike.williams@example.com',
    firstName: 'Michael',
    lastName: 'Williams',
    role: 'Instructor' as const,
    isActive: true,
    createdAt: '2024-09-20T13:40:00Z',
    updatedAt: '2025-04-10T16:30:00Z'
  }
] as const;

// Mock roles with correct types
const mockRoles: IRole[] = [
  { id: 'role-001', name: 'Admin' },
  { id: 'role-002', name: 'Instructor' },
  { id: 'role-003', name: 'Student' }
];

/**
 * Fetches the current authenticated user's profile.
 * Returns mock data for the demo.
 */
export async function getCurrentUserProfile(): Promise<IUser> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return first user from mock data
  return { ...mockUsers[0] };
}

/**
 * Updates the current user's profile.
 * @param profile Partial user fields to update (firstName, lastName, etc.)
 */
export async function updateUserProfile(
  profile: Partial<Pick<IUser, 'firstName' | 'lastName' | 'username'>>
): Promise<IUser> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create updated user by merging current mock user with updates
  const updatedUser = {
    ...mockUsers[0],
    ...profile,
    updatedAt: new Date().toISOString()
  };
  
  return updatedUser;
}

/**
 * Changes the current user's password.
 * @param currentPassword The user's current password
 * @param newPassword The new password to set
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Fake validation - in real app this would happen server-side
  if (currentPassword === 'wrong-password') {
    throw new Error('Current password is incorrect');
  }
  
  // Success case just resolves
  return;
}

/**
 * Fetches a user by ID (admin/instructor only).
 */
export async function getUserById(userId: string): Promise<IUser> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user in mock data
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return { ...user };
}

/**
 * Fetches a paginated list of users (admin only).
 */
export async function getUsers(
  params?: Partial<Pick<IPagination, 'page' | 'limit'>> & { search?: string; role?: string }
): Promise<IUserListResponse> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Default pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  
  // Filter by search term if provided
  let filteredUsers = [...mockUsers];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by role if provided
  if (params?.role) {
    filteredUsers = filteredUsers.filter(user => user.role === params.role);
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedUsers,
    meta: {
      page,
      limit,
      totalItems: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  };
}

/**
 * Fetches roles assigned to a user.
 */
export async function getUserRoles(userId: string): Promise<IRole[]> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user to determine their role
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return the matching role from mockRoles
  const userRole = mockRoles.find(role => role.name === user.role);
  return userRole ? [userRole] : [];
}

/**
 * Assigns a role to a user.
 */
export async function assignUserRole(userId: string, roleId: string): Promise<void> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the user and role
  const user = mockUsers.find(u => u.id === userId);
  const role = mockRoles.find(r => r.id === roleId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!role) {
    throw new Error('Role not found');
  }
  
  // In a real app, this would update the user's role in the database
  return;
}

/**
 * Removes a role from a user.
 */
export async function removeUserRole(userId: string, roleId: string): Promise<void> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the user and role
  const user = mockUsers.find(u => u.id === userId);
  const role = mockRoles.find(r => r.id === roleId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!role) {
    throw new Error('Role not found');
  }
  
  // In a real app, this would update the user's roles in the database
  return;
}
