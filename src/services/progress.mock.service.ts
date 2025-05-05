import progressData from '../../mocks/progress.mock.json'; // Renamed import for clarity
import {
  IUserCourseProgress,
  IUserCourseSpecificProgress,
  ILectureProgress // Import ILectureProgress if not already implicitly available
} from '../types/user.types';

// Explicitly type the imported JSON data structure, acknowledging 'null' for watchedAt
type MockLectureProgress = Omit<ILectureProgress, 'watchedAt'> & { watchedAt: string | null };
type MockCourseSpecificProgress = Omit<IUserCourseSpecificProgress, 'lectures'> & { lectures: MockLectureProgress[] };

const overallProgress: IUserCourseProgress[] = progressData.overall as IUserCourseProgress[];
// Map the courseSpecific data to match the IUserCourseSpecificProgress type exactly
const courseSpecificProgress: IUserCourseSpecificProgress[] =
  (progressData.courseSpecific as MockCourseSpecificProgress[]).map(p => ({
    ...p,
    lectures: p.lectures.map(l => ({
      ...l,
      // Convert null to undefined to match the ILectureProgress type
      watchedAt: l.watchedAt === null ? undefined : l.watchedAt,
    })),
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