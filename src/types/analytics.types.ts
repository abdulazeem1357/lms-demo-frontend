import { IApiResponse } from './user.types';

/**
 * Student engagement data point with timestamp and engagement value
 */
export interface IEngagementDataPoint {
  timestamp: string; // ISO 8601 date string
  value: number;     // Engagement value (0-100)
}

/**
 * Engagement metrics response from the API
 */
export interface IEngagementStats {
  userId?: string;
  courseId?: string;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    activeTime: IEngagementDataPoint[];
    resourcesAccessed: IEngagementDataPoint[];
    activityCompletion: IEngagementDataPoint[];
    overallEngagement: IEngagementDataPoint[];
  };
  summary?: {
    activeTime: number;
    resourcesAccessed: number;
    activityCompletion: number;
    overallEngagement: number;
  };
}

/**
 * Response when fetching engagement statistics
 */
export type IEngagementStatsResponse = IApiResponse<IEngagementStats>;

/**
 * Parameters for fetching engagement data
 */
export interface IEngagementStatsParams {
  userId?: string;
  courseId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  startDate?: string; // ISO 8601 date string
  endDate?: string;   // ISO 8601 date string
}