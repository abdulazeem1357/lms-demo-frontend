/**
 * Types related to deadlines across the LMS (assignments, quizzes, etc.)
 */

/**
 * Type of deadline (assignment, quiz, etc.)
 */
export type DeadlineType = 'assignment' | 'quiz' | 'live-lecture';

/**
 * Represents a unified deadline item in the LMS platform
 */
export interface IDeadline {
  /**
   * Unique identifier for the deadline
   */
  id: string;

  /**
   * Title of the deadline item
   */
  title: string;

  /**
   * Type of deadline (assignment, quiz, etc.)
   */
  type: DeadlineType;

  /**
   * Course ID that this deadline belongs to
   */
  courseId: string;

  /**
   * Course name for display purposes
   */
  courseName: string;

  /**
   * Module ID that this deadline belongs to
   */
  moduleId?: string;

  /**
   * Date when the item is due
   */
  dueDate: string; // ISO 8601 timestamp

  /**
   * Optional URL to navigate to when clicking on the deadline
   */
  url?: string;

  /**
   * Status of the deadline
   */
  status?: 'upcoming' | 'overdue' | 'submitted' | 'graded';

  /**
   * Description of the deadline item
   */
  description?: string;

  /**
   * Date when the item was created
   */
  createdAt: string; // ISO 8601

  /**
   * Date when the item was last updated
   */
  updatedAt: string; // ISO 8601
}

/**
 * Request parameters for fetching deadlines
 */
export interface IDeadlineParams {
  limit?: number;
  courseId?: string;
  moduleId?: string;
  type?: DeadlineType;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
}

/**
 * Response for fetching upcoming deadlines
 */
export interface IUpcomingDeadlinesResponse {
  deadlines: IDeadline[];
}

/**
 * Response structure for deadline endpoints
 */
export interface IDeadlineResponse {
  data: IDeadline[];
}