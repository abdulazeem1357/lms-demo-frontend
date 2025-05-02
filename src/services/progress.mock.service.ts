import progress from '../../mocks/progress.mock.json';
import {
  IUserCourseProgress,
  IUserCourseSpecificProgress
} from '../types/user.types';

/**
 * Returns overall progress for a user across all courses.
 */
export async function getUserOverallProgress(userId: string): Promise<IUserCourseProgress> {
  const record = (progress.overall as IUserCourseProgress[]).find(p => p.userId === userId);
  if (!record) throw new Error('Progress not found');
  return record;
}

/**
 * Returns course-specific progress for a user.
 */
export async function getUserCourseProgress(userId: string, courseId: string): Promise<IUserCourseSpecificProgress> {
  const record = (progress.courseSpecific as IUserCourseSpecificProgress[]).find(
    p => p.userId === userId && p.courseId === courseId
  );
  if (!record) throw new Error('Course progress not found');
  return record;
}
