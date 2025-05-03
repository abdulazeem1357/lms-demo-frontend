import { apiClient } from '../api/client';
import { IActivityItem, IUserActivitiesResponse } from '../types/activity.types';

/**
 * Fetches recent activity items for the specified user.
 * @param userId - UUID of the user
 * @param params - Optional parameters for pagination and filtering
 * @returns Promise resolving to an array of activity items
 */
export async function getUserActivity(
  userId: string, 
  params?: { 
    limit?: number; 
    page?: number;
    types?: string[];
    startDate?: string;
    endDate?: string;
  }
): Promise<IUserActivitiesResponse> {
  const { data } = await apiClient.get<IUserActivitiesResponse>(`/users/${userId}/activity`, { params });
  return data;
}

/**
 * Fetches a specific activity item by ID.
 * @param activityId - UUID of the activity
 * @returns Promise resolving to the activity item details
 */
export async function getActivityById(activityId: string): Promise<IActivityItem> {
  const { data } = await apiClient.get<{ data: IActivityItem }>(`/activity/${activityId}`);
  return data.data;
}