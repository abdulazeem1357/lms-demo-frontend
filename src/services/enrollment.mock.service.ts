import enrollments from '../../mocks/enrollments.mock.json';
import { IUserEnrollment, IEnrollmentCreateResponse, ICourseEnrollment } from '../types/enrollment.types';

/**
 * Returns mock enrollments for a user (GET /users/{userId}/enrollments)
 */
export async function getUserEnrollments(_userId: string): Promise<IUserEnrollment[]> {
  // Optionally filter by userId if your mock data supports it
  return Promise.resolve((enrollments.userEnrollments as IUserEnrollment[]));
}

/**
 * Mocks enrolling a user in a course (POST /users/{userId}/enrollments)
 */
export async function enrollUserInCourse(userId: string, courseId: string): Promise<IEnrollmentCreateResponse> {
  return Promise.resolve({
    enrollmentId: `mock-${Math.random().toString(36).slice(2)}`,
    userId,
    courseId,
    enrolledAt: new Date().toISOString(),
  });
}

/**
 * Mocks unenrolling a user from a course (DELETE /users/{userId}/enrollments/{enrollmentId})
 */
export async function unenrollUserFromCourse(_userId: string, _enrollmentId: string): Promise<void> {
  return Promise.resolve();
}

/**
 * Returns mock enrollments for a course (GET /courses/{courseId}/enrollments)
 */
export async function getCourseEnrollments(_courseId: string): Promise<ICourseEnrollment[]> {
  // Optionally filter by courseId if your mock data supports it
  return Promise.resolve((enrollments.courseEnrollments as ICourseEnrollment[]));
}
