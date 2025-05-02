import { apiClient } from '../api/client';
import {
  IUserCourseProgress,
  IUserCourseSpecificProgress
} from '../types/user.types';

/**
 * Fetches overall progress summary for a user across all enrolled courses.
 * @param userId - UUID of the user
 * @returns Promise resolving to IUserCourseProgress
 */
export async function getUserOverallProgress(userId: string): Promise<IUserCourseProgress> {
  const { data } = await apiClient.get<IUserCourseProgress>(`/users/${userId}/progress`);
  return data;
}

/**
 * Fetches detailed progress for a user within a specific course.
 * @param userId - UUID of the user
 * @param courseId - UUID of the course
 * @returns Promise resolving to IUserCourseSpecificProgress
 */
export async function getUserCourseProgress(userId: string, courseId: string): Promise<IUserCourseSpecificProgress> {
  const { data } = await apiClient.get<IUserCourseSpecificProgress>(`/users/${userId}/progress/course/${courseId}`);
  return data;
}
