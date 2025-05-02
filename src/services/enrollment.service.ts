import { apiClient } from '../api/client';
import {
  IUserEnrollment,
  IUserEnrollmentsResponse,
  IEnrollmentCreateRequest,
  IEnrollmentCreateResponse,
  ICourseEnrollmentsResponse,
  ICourseEnrollment
} from '../types/enrollment.types';

/**
 * Fetches the list of courses a user is enrolled in.
 * @param userId - UUID of the user
 * @returns Promise resolving to the user's enrollments
 */
export async function getUserEnrollments(userId: string): Promise<IUserEnrollment[]> {
  const { data } = await apiClient.get<IUserEnrollmentsResponse>(`/users/${userId}/enrollments`);
  return data.data;
}

/**
 * Enrolls a user in a course.
 * @param userId - UUID of the user
 * @param courseId - UUID of the course
 * @returns Promise resolving to the enrollment creation response
 */
export async function enrollUserInCourse(userId: string, courseId: string): Promise<IEnrollmentCreateResponse> {
  const { data } = await apiClient.post<IEnrollmentCreateResponse>(`/users/${userId}/enrollments`, { courseId } as IEnrollmentCreateRequest);
  return data;
}

/**
 * Unenrolls a user from a course.
 * @param userId - UUID of the user
 * @param enrollmentId - UUID of the enrollment record
 * @returns Promise resolving to void
 */
export async function unenrollUserFromCourse(userId: string, enrollmentId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/enrollments/${enrollmentId}`);
}

/**
 * Fetches the list of students enrolled in a course.
 * @param courseId - UUID of the course
 * @returns Promise resolving to the course enrollments
 */
export async function getCourseEnrollments(courseId: string): Promise<ICourseEnrollment[]> {
  const { data } = await apiClient.get<ICourseEnrollmentsResponse>(`/courses/${courseId}/enrollments`);
  return data.data;
}
