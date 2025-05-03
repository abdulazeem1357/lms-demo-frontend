import { apiClient } from '../api/client';
import { IDeadline, IDeadlineParams, IDeadlineResponse } from '../types/deadline.types';

/**
 * Fetches upcoming deadlines for the authenticated user.
 * @param params - Optional parameters to filter deadlines
 * @returns Promise resolving to an array of deadlines
 */
export async function getUpcomingDeadlines(params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const { data } = await apiClient.get<IDeadlineResponse>('/deadlines/upcoming', { params });
  return data.data;
}

/**
 * Fetches deadlines for a specific course.
 * @param courseId - The ID of the course to fetch deadlines for
 * @param params - Optional parameters to filter deadlines
 * @returns Promise resolving to an array of deadlines
 */
export async function getCourseDeadlines(courseId: string, params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const { data } = await apiClient.get<IDeadlineResponse>(`/courses/${courseId}/deadlines`, { 
    params: { ...params, courseId } 
  });
  return data.data;
}

/**
 * Fetches deadlines for a specific module.
 * @param moduleId - The ID of the module to fetch deadlines for
 * @param params - Optional parameters to filter deadlines
 * @returns Promise resolving to an array of deadlines
 */
export async function getModuleDeadlines(moduleId: string, params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const { data } = await apiClient.get<IDeadlineResponse>(`/modules/${moduleId}/deadlines`, {
    params: { ...params, moduleId }
  });
  return data.data;
}