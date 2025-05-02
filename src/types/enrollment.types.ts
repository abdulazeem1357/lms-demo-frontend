import { IApiResponse, ICourseSummary } from './user.types';

/**
 * Represents a user's enrollment in a course.
 */
export interface IUserEnrollment {
  enrollmentId: string;
  course: ICourseSummary;
  enrolledAt: string;    // ISO 8601 timestamp
}

/**
 * Response for GET /users/{userId}/enrollments
 */
export type IUserEnrollmentsResponse = IApiResponse<IUserEnrollment[]>;

/**
 * Payload for POST /users/{userId}/enrollments
 */
export interface IEnrollmentCreateRequest {
  courseId: string;
}

/**
 * Response for POST /users/{userId}/enrollments
 */
export interface IEnrollmentCreateResponse {
  enrollmentId: string;
  userId: string;
  courseId: string;
  enrolledAt: string;    // ISO 8601 timestamp
}

/**
 * Represents a student for course enrollment listing.
 */
export interface ICourseStudent {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

/**
 * Represents an enrollment record in a course context.
 */
export interface ICourseEnrollment {
  enrollmentId: string;
  student: ICourseStudent;
  enrolledAt: string;    // ISO 8601 timestamp
}

/**
 * Response for GET /courses/{courseId}/enrollments
 */
export type ICourseEnrollmentsResponse = IApiResponse<ICourseEnrollment[]>;