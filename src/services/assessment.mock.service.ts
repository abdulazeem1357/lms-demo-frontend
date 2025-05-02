// assessment.mock.service.ts
// Mock service for quizzes and assignments (LMS Student Portal)
import quizzes from '../../mocks/quizzes.mock.json';
import assignments from '../../mocks/assignments.mock.json';
import submissions from '../../mocks/submissions.mock.json';
import {
  IQuiz,
  IAssignment
} from '../types/course.types';
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

// Helper: find quiz by id
function findQuizById(quizId: string): IQuiz | undefined {
  return (quizzes as IQuiz[]).find(q => q.id === quizId);
}

// Helper: find assignment by id
function findAssignmentById(assignmentId: string): IAssignment | undefined {
  return (assignments as IAssignment[]).find(a => a.id === assignmentId);
}

// Helper: find quiz submissions by quizId
function getQuizSubmissionsByQuizId(quizId: string): IQuizSubmission[] {
  return (submissions.quizSubmissions || []).filter((s: any) => s.quizId === quizId).map((s: any) => ({
    submissionId: s.submissionId,
    quizId: s.quizId,
    userId: s.userId,
    submittedAt: s.submittedAt,
    status: s.status as 'pending' | 'graded',
    score: s.status === 'graded' ? s.totalScore : undefined
  }));
}

// Helper: find quiz submission detail by submissionId
function getQuizSubmissionDetailById(submissionId: string): IQuizSubmissionDetail | undefined {
  const s = (submissions.quizSubmissions || []).find((s: any) => s.submissionId === submissionId);
  if (!s) return undefined;
  return {
    submissionId: s.submissionId,
    quizId: s.quizId,
    userId: s.userId,
    submittedAt: s.submittedAt,
    status: s.status as 'pending' | 'graded',
    autoGraded: s.autoGraded,
    answers: s.answers.map((a: any) => ({
      ...a,
      type: a.type as 'single_choice' | 'true_false' | 'short_answer' | 'multiple_choice',
    })),
    overallFeedback: s.overallFeedback === null ? undefined : s.overallFeedback,
    totalScore: s.totalScore
  };
}

// Helper: find assignment submissions by assignmentId
function getAssignmentSubmissionsByAssignmentId(assignmentId: string): IAssignmentSubmission[] {
  return (submissions.assignmentSubmissions || []).filter((s: any) => s.assignmentId === assignmentId).map((s: any) => ({
    submissionId: s.submissionId,
    userId: s.userId,
    submittedAt: s.submittedAt,
    fileUrl: s.fileUrl
  }));
}

// Helper: find assignment submission detail by submissionId
function getAssignmentSubmissionDetailById(submissionId: string): IAssignmentSubmissionDetail | undefined {
  const s = (submissions.assignmentSubmissions || []).find((s: any) => s.submissionId === submissionId);
  if (!s) return undefined;
  return {
    submissionId: s.submissionId,
    assignmentId: s.assignmentId,
    userId: s.userId,
    submittedAt: s.submittedAt,
    fileName: s.fileName,
    fileSize: s.fileSize,
    contentType: s.contentType,
    fileUrl: s.fileUrl
  };
}

// Quizzes
export async function getModuleQuizzes(moduleId: string): Promise<IQuiz[]> {
  // Return quizzes for the given moduleId, matching IQuiz from course.types.ts
  return Promise.resolve((quizzes as IQuiz[]).filter(q => q.moduleId === moduleId));
}

export async function getQuizById(quizId: string): Promise<IQuiz> {
  const quiz = findQuizById(quizId);
  if (!quiz) throw new Error('Quiz not found');
  return Promise.resolve(quiz);
}

export async function createModuleQuiz(moduleId: string, payload: Omit<IQuiz, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IQuiz> {
  // Create a new quiz object matching IQuiz
  const newQuiz: IQuiz = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    moduleId,
    title: payload.title,
    description: payload.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(newQuiz);
}

export async function updateQuiz(quizId: string, payload: Partial<Omit<IQuiz, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>): Promise<IQuiz> {
  const quiz = findQuizById(quizId);
  if (!quiz) throw new Error('Quiz not found');
  return Promise.resolve({ ...quiz, ...payload, updatedAt: new Date().toISOString() });
}

export async function deleteQuiz(_quizId: string): Promise<void> {
  return Promise.resolve();
}

// Quiz Submissions
export async function getQuizSubmissions(quizId: string): Promise<IQuizSubmission[]> {
  return Promise.resolve(getQuizSubmissionsByQuizId(quizId));
}

export async function getQuizSubmissionDetail(submissionId: string): Promise<IQuizSubmissionDetail> {
  const detail = getQuizSubmissionDetailById(submissionId);
  if (!detail) throw new Error('Submission not found');
  return Promise.resolve(detail);
}

export async function gradeQuizSubmission(submissionId: string, payload: IQuizGradeRequest): Promise<IQuizGradeResponse> {
  // Stub: return a mock graded response
  return Promise.resolve({
    submissionId,
    status: 'graded',
    autoGraded: !!payload.autoGrade,
    grade: 100,
    gradedAt: new Date().toISOString()
  });
}

// Assignments
export async function getModuleAssignments(moduleId: string): Promise<IAssignment[]> {
  return Promise.resolve((assignments as IAssignment[]).filter(a => a.moduleId === moduleId));
}

export async function createModuleAssignment(moduleId: string, payload: Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IAssignment> {
  // Mock: create a new assignment object
  const newAssignment: IAssignment = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    moduleId,
    title: payload.title,
    description: payload.description || '',
    dueDate: payload.dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(newAssignment);
}

export async function getAssignmentById(assignmentId: string): Promise<IAssignment> {
  const assignment = findAssignmentById(assignmentId);
  if (!assignment) throw new Error('Assignment not found');
  return Promise.resolve(assignment);
}

export async function updateAssignment(assignmentId: string, payload: Partial<Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>): Promise<IAssignment> {
  const assignment = findAssignmentById(assignmentId);
  if (!assignment) throw new Error('Assignment not found');
  return Promise.resolve({ ...assignment, ...payload, updatedAt: new Date().toISOString() });
}

export async function deleteAssignment(_assignmentId: string): Promise<void> {
  return Promise.resolve();
}

// Assignment Submissions
export async function getAssignmentSubmissions(assignmentId: string): Promise<IAssignmentSubmission[]> {
  return Promise.resolve(getAssignmentSubmissionsByAssignmentId(assignmentId));
}

export async function getAssignmentSubmissionDetail(submissionId: string): Promise<IAssignmentSubmissionDetail> {
  const detail = getAssignmentSubmissionDetailById(submissionId);
  if (!detail) throw new Error('Assignment submission not found');
  return Promise.resolve(detail);
}

export async function gradeAssignmentSubmission(submissionId: string, payload: IAssignmentGradeRequest): Promise<IAssignmentGradeResponse> {
  // Stub: return a mock graded response
  return Promise.resolve({
    submissionId,
    status: 'graded',
    score: payload.score,
    feedback: payload.feedback,
    annotatedFileUrl: payload.annotatedFileUrl,
    gradedAt: new Date().toISOString()
  });
}
