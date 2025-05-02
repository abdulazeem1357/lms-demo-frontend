import { IApiResponse } from './user.types';

/**
 * Summary of an assignment submission.
 */
export interface IAssignmentSubmission {
  submissionId: string;
  userId: string;
  submittedAt: string; // ISO 8601 timestamp
  fileUrl: string;
}

/**
 * Detailed assignment submission information.
 */
export interface IAssignmentSubmissionDetail {
  submissionId: string;
  assignmentId: string;
  userId: string;
  submittedAt: string; // ISO 8601 timestamp
  fileName: string;
  fileSize: number;   // bytes
  contentType: string;
  fileUrl: string;
}

/**
 * Response when fetching a list of assignment submissions.
 */
export type IAssignmentSubmissionsResponse = IApiResponse<IAssignmentSubmission[]>;

/**
 * Response when fetching detailed assignment submission info.
 */
export type IAssignmentSubmissionDetailResponse = IApiResponse<IAssignmentSubmissionDetail>;

/**
 * Summary of a quiz submission.
 */
export interface IQuizSubmission {
  submissionId: string;
  quizId: string;
  userId: string;
  submittedAt: string; // ISO 8601 timestamp
  status: 'pending' | 'graded';
  score?: number;
}

/**
 * Individual answer within a quiz submission.
 */
export interface IQuizAnswer {
  questionId: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';
  answer: string | string[];
  isCorrect?: boolean;
  score: number;
  feedback?: string;
}

/**
 * Detailed quiz submission information.
 */
export interface IQuizSubmissionDetail {
  submissionId: string;
  quizId: string;
  userId: string;
  submittedAt: string; // ISO 8601 timestamp
  status: 'pending' | 'graded';
  autoGraded: boolean;
  answers: IQuizAnswer[];
  overallFeedback?: string;
  totalScore: number;
}

/**
 * Response when fetching a list of quiz submissions.
 */
export type IQuizSubmissionsResponse = IApiResponse<IQuizSubmission[]>;

/**
 * Response when fetching detailed quiz submission info.
 */
export type IQuizSubmissionDetailResponse = IApiResponse<IQuizSubmissionDetail>;