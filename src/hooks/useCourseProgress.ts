import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as progressService from '../services/progress';
import * as courseService from '../services/course';
import { calculateProgress } from '../utils/progressUtils';

export interface UseCourseProgressResult {
  completionPercentage: number;
  isLoading: boolean;
}

/**
 * Custom hook to fetch and calculate a user's course completion percentage.
 * Combines quiz, assignment, and lecture progress into a single percentage.
 */
export function useCourseProgress(userId: string, courseId: string): UseCourseProgressResult {
  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ['courseProgress', userId, courseId],
    queryFn: () => progressService.getUserCourseProgress(userId, courseId),
    enabled: Boolean(userId) && Boolean(courseId),
  });

  const { data: modules, isLoading: loadingModules } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => courseService.getCourseModules(courseId),
    enabled: Boolean(courseId),
  });

  const completionPercentage = useMemo(() => {
    if (!progress || !modules) return 0;
    if (progress.completionStatus === 'completed') return 100;

    const totalLecturesInCourse = modules.reduce(
      (count, module) => count + (module.chapters?.length || 0),
      0
    );

    return calculateProgress(
      progress.quizzes,
      progress.assignments,
      progress.lectures,
      totalLecturesInCourse
    );
  }, [progress, modules]);

  const isLoading = loadingProgress || loadingModules;
  return { completionPercentage, isLoading };
}
