import { apiClient } from '../api/client';
import {
  IQuiz,
  IQuizListResponse,
  IAssignment,
  IAssignmentListResponse
} from '../types/course.types';
import {
  IQuizSubmission,
  IQuizSubmissionsResponse,
  IQuizSubmissionDetail,
  IQuizSubmissionDetailResponse,
  IQuizGradeRequest,
  IQuizGradeResponse,
  IAssignmentSubmission,
  IAssignmentSubmissionsResponse,
  IAssignmentSubmissionDetail,
  IAssignmentSubmissionDetailResponse,
  IAssignmentGradeRequest,
  IAssignmentGradeResponse
} from '../types/assessment.types';

/**
 * Fetches quizzes for a module.
 */
export async function getModuleQuizzes(moduleId: string): Promise<IQuiz[]> {
  const { data } = await apiClient.get<IQuizListResponse>(`/modules/${moduleId}/quizzes`);
  return data.data;
}

/**
 * Creates a new quiz in a module.
 */
export async function createModuleQuiz(moduleId: string, payload: Omit<IQuiz, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IQuiz> {
  const { data } = await apiClient.post<{ data: IQuiz }>(`/modules/${moduleId}/quizzes`, payload);
  return data.data;
}

/**
 * Fetches quiz details by ID (with questions).
 */
export async function getQuizById(quizId: string): Promise<IQuiz> {
  const { data } = await apiClient.get<{ data: IQuiz }>(`/quizzes/${quizId}`);
  return data.data;
}

/**
 * Updates a quiz and/or its questions.
 */
export async function updateQuiz(quizId: string, payload: Partial<Omit<IQuiz, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>): Promise<IQuiz> {
  const { data } = await apiClient.put<{ data: IQuiz }>(`/quizzes/${quizId}`, payload);
  return data.data;
}

/**
 * Deletes a quiz by ID.
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  await apiClient.delete(`/quizzes/${quizId}`);
}

/**
 * Fetches submissions for a quiz.
 */
export async function getQuizSubmissions(quizId: string): Promise<IQuizSubmission[]> {
  const { data } = await apiClient.get<IQuizSubmissionsResponse>(`/quizzes/${quizId}/submissions`);
  return data.data;
}

/**
 * Fetches details for a specific quiz submission.
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

/**
 * Fetches assignments for a module.
 */
export async function getModuleAssignments(moduleId: string): Promise<IAssignment[]> {
  const { data } = await apiClient.get<IAssignmentListResponse>(`/modules/${moduleId}/assignments`);
  return data.data;
}

/**
 * Creates a new assignment in a module.
 */
export async function createModuleAssignment(moduleId: string, payload: Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IAssignment> {
  const { data } = await apiClient.post<{ data: IAssignment }>(`/modules/${moduleId}/assignments`, payload);
  return data.data;
}

/**
 * Fetches assignment details by ID.
 */
export async function getAssignmentById(assignmentId: string): Promise<IAssignment> {
  const { data } = await apiClient.get<{ data: IAssignment }>(`/assignments/${assignmentId}`);
  return data.data;
}

/**
 * Updates an assignment by ID.
 */
export async function updateAssignment(assignmentId: string, payload: Partial<Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>): Promise<IAssignment> {
  const { data } = await apiClient.put<{ data: IAssignment }>(`/assignments/${assignmentId}`, payload);
  return data.data;
}

/**
 * Deletes an assignment by ID.
 */
export async function deleteAssignment(assignmentId: string): Promise<void> {
  await apiClient.delete(`/assignments/${assignmentId}`);
}

/**
 * Fetches submissions for an assignment.
 */
export async function getAssignmentSubmissions(assignmentId: string): Promise<IAssignmentSubmission[]> {
  const { data } = await apiClient.get<IAssignmentSubmissionsResponse>(`/assignments/${assignmentId}/submissions`);
  return data.data;
}

/**
 * Fetches details for a specific assignment submission.
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
