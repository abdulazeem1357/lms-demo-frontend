import { apiClient } from '../api/client';
import { 
  IEngagementStats, 
  IEngagementStatsResponse, 
  IEngagementStatsParams 
} from '../types/analytics.types';

/**
 * Fetches user engagement statistics with optional filtering
 * @param params - Optional parameters for filtering data
 * @returns Promise resolving to engagement statistics
 */
export async function getEngagementStats(params?: IEngagementStatsParams): Promise<IEngagementStats> {
  const { data } = await apiClient.get<IEngagementStatsResponse>('/analytics/engagement', { params });
  return data.data;
}