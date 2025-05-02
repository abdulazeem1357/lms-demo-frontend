import { IApiResponse } from './user.types';

/**
 * Summary of an assignment submission.
 */
export interface IAssignmentSubmission {
  submissionId: string;
  userId: string;
  submittedAt: string;      // ISO 8601 timestamp
  fileUrl: string;
}

/**
 * Detailed info for an assignment submission.
 */
export interface IAssignmentSubmissionDetail {
  submissionId: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;      // ISO 8601 timestamp
  fileName: string;
  fileSize: number;         // bytes
  contentType: string;
  fileUrl: string;
}

/**
 * Response for list of assignment submissions.
 */
export type IAssignmentSubmissionsResponse = IApiResponse<IAssignmentSubmission[]>;

/**
 * Response for a single assignment submission detail.
 */
export type IAssignmentSubmissionDetailResponse = IApiResponse<IAssignmentSubmissionDetail>;

/**
 * Payload for grading an assignment submission.
 */
export interface IAssignmentGradeRequest {
  score: number;
  feedback?: string;
  annotatedFileUrl?: string;
}

/**
 * Response after grading an assignment submission.
 */
export interface IAssignmentGradeResponse {
  submissionId: string;
  status: 'graded';
  score: number;
  feedback?: string;
  annotatedFileUrl?: string;
  gradedAt: string;         // ISO 8601 timestamp
}

/**
 * Summary of a quiz submission.
 */
export interface IQuizSubmission {
  submissionId: string;
  quizId: string;
  userId: string;
  submittedAt: string;      // ISO 8601 timestamp
  status: 'pending' | 'graded';
  score?: number;
}

/**
 * Individual answer in a quiz submission detail.
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
 * Detailed info for a quiz submission.
 */
export interface IQuizSubmissionDetail {
  submissionId: string;
  quizId: string;
  userId: string;
  submittedAt: string;      // ISO 8601 timestamp
  status: 'pending' | 'graded';
  autoGraded: boolean;
  answers: IQuizAnswer[];
  overallFeedback?: string;
  totalScore: number;
}

/**
 * Response for list of quiz submissions.
 */
export type IQuizSubmissionsResponse = IApiResponse<IQuizSubmission[]>;

/**
 * Response for a single quiz submission detail.
 */
export type IQuizSubmissionDetailResponse = IApiResponse<IQuizSubmissionDetail>;

/**
 * Payload for grading a quiz submission.
 */
export interface IQuizGradeRequest {
  autoGrade?: boolean;
  scores: Array<{
    questionId: string;
    score: number;
    feedback?: string;
  }>;
  overallFeedback?: string;
}

/**
 * Response after grading a quiz submission.
 */
export interface IQuizGradeResponse {
  submissionId: string;
  status: 'graded';
  autoGraded: boolean;
  grade: number;
  gradedAt: string;         // ISO 8601 timestamp
}