import progressData from '../../mocks/progress.mock.json';
import {
  IUserCourseProgress,
  IUserCourseSpecificProgress
} from '../types/user.types';

// Define the mock data structure types to match the JSON
interface MockQuizProgress {
  quizId: string;
  status: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

interface MockAssignmentProgress {
  assignmentId: string;
  status: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  grade: string;
}

interface MockLectureProgress {
  lectureId: string;
  status: 'watched' | 'not_watched';
  watchedAt: string | null;
}

interface MockCourseProgress {
  userId: string;
  courseId: string;
  courseTitle: string;
  completionStatus: 'in_progress' | 'completed';
  quizzes: MockQuizProgress[];
  assignments: MockAssignmentProgress[];
  lectures: MockLectureProgress[];
}

const overallProgress: IUserCourseProgress[] = progressData.overall as IUserCourseProgress[];

// Map the mock data to match our interface types
const courseSpecificProgress: IUserCourseSpecificProgress[] =
  (progressData.courseSpecific as MockCourseProgress[]).map(p => ({
    userId: p.userId,
    courseId: p.courseId,
    courseTitle: p.courseTitle,
    completionStatus: p.completionStatus,
    quizzes: p.quizzes.map(q => ({
      quizId: q.quizId,
      title: q.quizId, // Use ID as title since it's missing in mock
      status: q.status as 'pending' | 'graded',
      score: q.score,
      maxScore: q.maxScore,
      gradedAt: q.completedAt
    })),
    assignments: p.assignments.map(a => ({
      assignmentId: a.assignmentId,
      title: a.assignmentId, // Use ID as title since it's missing in mock
      status: a.status as 'pending' | 'graded',
      score: a.score,
      maxScore: a.maxScore,
      gradedAt: a.submittedAt
    })),
    lectures: p.lectures.map(l => ({
      lectureId: l.lectureId,
      status: l.status,
      watchedAt: l.watchedAt ?? undefined
    }))
  }));

/**
 * Returns overall progress for a user across all courses.
 * @param userId - UUID of the user
 * @returns Promise resolving to IUserCourseProgress
 */
export async function getUserOverallProgress(userId: string): Promise<IUserCourseProgress> {
  // Use the correctly typed variable
  const record = overallProgress.find(p => p.userId === userId);
  if (!record) throw new Error('Progress not found');
  return record;
}

/**
 * Returns course-specific progress for a user.
 * @param userId - UUID of the user
 * @param courseId - UUID of the course
 * @returns Promise resolving to IUserCourseSpecificProgress
 */
export async function getUserCourseProgress(userId: string, courseId: string): Promise<IUserCourseSpecificProgress> {
  // Use the correctly typed and mapped variable
  const record = courseSpecificProgress.find(
    p => p.userId === userId && p.courseId === courseId
  );
  if (!record) throw new Error('Course progress not found');
  return record;
}