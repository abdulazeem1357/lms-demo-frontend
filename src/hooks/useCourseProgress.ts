import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as progressService from '../services/progress';
import * as courseService from '../services/course'; // Assuming courseService has getCourseLectures
import { calculateProgress } from '../utils/progressUtils';
import { IUserCourseSpecificProgress } from '../types/user.types';
import { ILecture } from '../types/course.types'; // Import ILecture

export interface UseCourseProgressResult {
  completionPercentage: number;
  isLoading: boolean;
}

/**
 * Custom hook to fetch and calculate a user's course completion percentage.
 * Combines quiz, assignment, and lecture progress into a single percentage.
 */
export function useCourseProgress(userId: string, courseId: string): UseCourseProgressResult {
  // Fetch user-specific progress (quizzes, assignments, watched lectures)
  const { data: progress, isLoading: loadingProgress } = useQuery<IUserCourseSpecificProgress>({
    queryKey: ['courseProgress', userId, courseId],
    queryFn: () => progressService.getUserCourseProgress(userId, courseId),
    enabled: !!userId && !!courseId,
  });

  // Fetch all lectures for the course to get the total count
  const { data: courseLecturesData, isLoading: loadingLectures } = useQuery<{ data: ILecture[] }>({
    queryKey: ['courseLectures', courseId],
    // Assuming a function exists to get all lectures for a course
    queryFn: () => courseService.getCourseLectures(courseId), 
    enabled: !!courseId,
  });

  const completionPercentage = useMemo(() => {
    // Ensure both progress data and total lecture data are available
    if (!progress || !courseLecturesData) return 0;
    if (progress.completionStatus === 'completed') return 100;

    // Get the total number of lectures from the fetched course lecture data
    const totalLecturesInCourse = courseLecturesData.data?.length || 0;

    // Calculate progress using the utility function
    return calculateProgress(
      progress.quizzes,
      progress.assignments,
      progress.lectures, // User's watched lecture status
      totalLecturesInCourse // Total lectures in the course
    );
  }, [progress, courseLecturesData]); // Dependencies updated

  // Overall loading state depends on both queries
  const isLoading = loadingProgress || loadingLectures;

  return { completionPercentage, isLoading };
}
