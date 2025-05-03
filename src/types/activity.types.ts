import { IApiResponse } from './user.types';

/**
 * Types of activities that can be recorded in the system.
 */
export type ActivityType = 
  | 'assignment_submission' 
  | 'quiz_completion' 
  | 'course_enrollment' 
  | 'lecture_watched' 
  | 'discussion_post' 
  | 'grade_received';

/**
 * Represents a single activity item in a user's timeline.
 */
export interface IActivityItem {
  activityId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  resourceId: string; // ID of the related resource (assignment, quiz, course, etc.)
  resourceType: string; // Type of resource this activity relates to
  courseId?: string; // Optional course ID if activity is course-related
  courseName?: string; // Optional course name if activity is course-related
  timestamp: string; // ISO 8601 timestamp
  metadata?: Record<string, any>; // Additional data specific to the activity type
}

/**
 * Response for retrieving activity items.
 */
export interface IUserActivitiesResponse extends IApiResponse<IActivityItem[]> {
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}