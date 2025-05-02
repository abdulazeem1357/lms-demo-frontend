/**
 * Represents a user in the LMS.
 */
export interface IUser {
    id: string;              // UUID of the user
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Instructor' | 'Student';
    isActive: boolean;
    createdAt: string;       // ISO 8601 timestamp
    updatedAt: string;       // ISO 8601 timestamp
  }
  
  /**
   * Represents a role assignment.
   */
  export interface IRole {
    id: string;              // UUID of the role
    name: 'Admin' | 'Instructor' | 'Student';
  }
  
  /**
   * Common pagination metadata.
   */
  export interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  }
  
  /**
   * Response when fetching a list of users.
   */
  export interface IUserListResponse {
    data: IUser[];
    meta: IPagination;
  }
  
  /**
   * Response when fetching a single user.
   */
  export interface IUserDetailResponse {
    data: IUser;
  }
  
  /**
   * Response when fetching roles assigned to a user.
   */
  export interface IUserRolesResponse {
    data: IRole[];
  }
  
  /**
   * Request payload for assigning a role to a user.
   */
  export interface IUserAssignRoleRequest {
    roleId: string;
  }
  
  /**
   * Represents a course summary for enrollment contexts.
   */
  export interface ICourseSummary {
    id: string;
    title: string;
    description: string;
  }
  
  /**
   * Represents an enrollment record.
   */
  export interface IEnrollment {
    enrollmentId: string;
    userId?: string;
    course: ICourseSummary;
    enrolledAt: string;      // ISO 8601 timestamp
  }
  
  /**
   * Overall progress summary for a user across courses.
   */
  export interface IUserCourseProgress {
    userId: string;
    coursesEnrolled: number;
    coursesCompleted: number;
    overallCompletionRate: number;
    averageScore: number;
  }
  
  /**
   * Progress details for a user within a specific course.
   */
  export interface IQuizProgress {
    quizId: string;
    title: string;
    score: number;
    maxScore: number;
    status: 'pending' | 'graded';
    gradedAt: string;        // ISO 8601 timestamp
  }
  
  export interface IAssignmentProgress {
    assignmentId: string;
    title: string;
    score: number;
    maxScore: number;
    status: 'pending' | 'graded';
    gradedAt: string;        // ISO 8601 timestamp
  }
  
  export interface IUserCourseSpecificProgress {
    userId: string;
    courseId: string;
    courseTitle: string;
    completionStatus: 'in_progress' | 'completed';
    quizzes: IQuizProgress[];
    assignments: IAssignmentProgress[];
  }
  
  /**
   * Standard API error object.
   */
  export interface IApiError {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  }
  
  /**
   * Generic API response wrapper.
   */
  export interface IApiResponse<T> {
    data: T;
  }
  