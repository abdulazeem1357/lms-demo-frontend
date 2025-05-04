import submissions from '../../mocks/submissions.mock.json';
import {
  IQuizSubmission,
  IQuizSubmissionDetail,
  IQuizGradeRequest,
  IQuizGradeResponse,
  IAssignmentSubmission,
  IAssignmentSubmissionDetail,
  IAssignmentGradeRequest,
  IAssignmentGradeResponse
} from '../types/assessment.types';

/**
 * Mock implementation for getting assignment submissions
 */
export async function getAssignmentSubmissions(assignmentId: string): Promise<IAssignmentSubmission[]> {
  const filteredSubmissions = (submissions.assignmentSubmissions as IAssignmentSubmission[])
    .filter(s => s.submissionId.startsWith(assignmentId));
  return Promise.resolve(filteredSubmissions);
}

/**
 * Mock implementation for getting assignment submission detail
 */
export async function getAssignmentSubmissionDetail(submissionId: string): Promise<IAssignmentSubmissionDetail> {
  const detail = (submissions.assignmentSubmissions as IAssignmentSubmissionDetail[])
    .find(s => s.submissionId === submissionId);
  if (!detail) throw new Error('Assignment submission not found');
  return Promise.resolve(detail);
}

/**
 * Mock implementation for grading assignment submission
 */
export async function gradeAssignmentSubmission(
  submissionId: string, 
  payload: IAssignmentGradeRequest
): Promise<IAssignmentGradeResponse> {
  return Promise.resolve({
    submissionId,
    status: 'graded',
    score: payload.score,
    feedback: payload.feedback,
    annotatedFileUrl: payload.annotatedFileUrl,
    gradedAt: new Date().toISOString()
  });
}

/**
 * Mock implementation for submitting an assignment with a file
 */
export async function submitAssignment(assignmentId: string, file: File, comments?: string): Promise<IAssignmentSubmission> {
  // Simulate a delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a mock submission
  const mockSubmission: IAssignmentSubmission = {
    submissionId: `submission-${Date.now()}`,
    userId: 'current-user-id',
    submittedAt: new Date().toISOString(),
    fileUrl: URL.createObjectURL(file)
  };

  console.log('Mock assignment submission:', { 
    assignmentId, 
    fileName: file.name, 
    fileSize: file.size,
    comments,
    submission: mockSubmission
  });
  
  return Promise.resolve(mockSubmission);
}

/**
 * Mock implementation for getting quiz submissions
 */
export async function getQuizSubmissions(quizId: string): Promise<IQuizSubmission[]> {
  const filteredSubmissions = (submissions.quizSubmissions as IQuizSubmission[])
    .filter(s => s.quizId === quizId);
  return Promise.resolve(filteredSubmissions);
}

/**
 * Mock implementation for getting quiz submission detail
 */
export async function getQuizSubmissionDetail(submissionId: string): Promise<IQuizSubmissionDetail> {
  const detail = (submissions.quizSubmissions as IQuizSubmissionDetail[])
    .find(s => s.submissionId === submissionId);
  if (!detail) throw new Error('Quiz submission not found');
  return Promise.resolve(detail);
}

/**
 * Mock implementation for grading quiz submission
 */
export async function gradeQuizSubmission(
  submissionId: string, 
  payload: IQuizGradeRequest
): Promise<IQuizGradeResponse> {
  return Promise.resolve({
    submissionId,
    status: 'graded',
    autoGraded: !!payload.autoGrade,
    grade: payload.scores?.reduce((sum, s) => sum + s.score, 0) ?? 100,
    gradedAt: new Date().toISOString()
  });
}
