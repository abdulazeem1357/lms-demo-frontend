import { apiClient } from '../api/client';
import {
  IAssignmentSubmission,
  IAssignmentSubmissionsResponse,
  IAssignmentSubmissionDetail,
  IAssignmentSubmissionDetailResponse,
  IQuizSubmission,
  IQuizSubmissionsResponse,
  IQuizSubmissionDetail,
  IQuizSubmissionDetailResponse
} from '../types/submission.types';
import {
  IAssignmentGradeRequest,
  IAssignmentGradeResponse,
  IQuizGradeRequest,
  IQuizGradeResponse
} from '../types/assessment.types';

/**
 * Fetches all submissions for a specific assignment.
 */
export async function getAssignmentSubmissions(assignmentId: string): Promise<IAssignmentSubmission[]> {
  const { data } = await apiClient.get<IAssignmentSubmissionsResponse>(`/assignments/${assignmentId}/submissions`);
  return data.data;
}

/**
 * Fetches detailed information for a specific assignment submission.
 */
export async function getAssignmentSubmissionDetail(submissionId: string): Promise<IAssignmentSubmissionDetail> {
  const { data } = await apiClient.get<IAssignmentSubmissionDetailResponse>(`/submissions/assignment/${submissionId}`);
  return data.data;
}

/**
 * Grades an assignment submission.
 */
export async function gradeAssignmentSubmission(submissionId: string, payload: IAssignmentGradeRequest): Promise<IAssignmentGradeResponse> {
  const { data } = await apiClient.post<IAssignmentGradeResponse>(`/submissions/assignment/${submissionId}/grade`, payload);
  return data;
}

/**
 * Fetches all submissions for a specific quiz.
 */
export async function getQuizSubmissions(quizId: string): Promise<IQuizSubmission[]> {
  const { data } = await apiClient.get<IQuizSubmissionsResponse>(`/quizzes/${quizId}/submissions`);
  return data.data;
}

/**
 * Fetches detailed information for a specific quiz submission.
 */
export async function getQuizSubmissionDetail(submissionId: string): Promise<IQuizSubmissionDetail> {
  const { data } = await apiClient.get<IQuizSubmissionDetailResponse>(`/submissions/quiz/${submissionId}`);
  return data.data;
}

/**
 * Grades a quiz submission.
 */
export async function gradeQuizSubmission(submissionId: string, payload: IQuizGradeRequest): Promise<IQuizGradeResponse> {
  const { data } = await apiClient.post<IQuizGradeResponse>(`/submissions/quiz/${submissionId}/grade`, payload);
  return data;
}
