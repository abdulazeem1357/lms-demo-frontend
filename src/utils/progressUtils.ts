import { IQuizProgress, IAssignmentProgress, ILectureProgress } from '../types/user.types'; // <-- Import ILectureProgress

/**
 * Calculates the overall progress percentage based on graded quizzes, assignments, and watched lectures.
 * Quiz/Assignment progress is based on score; Lecture progress is based on completion count.
 * The final percentage is an average of the quiz/assignment component and the lecture component.
 *
 * @param quizzes - Array of quiz progress objects. Defaults to an empty array.
 * @param assignments - Array of assignment progress objects. Defaults to an empty array.
 * @param lectures - Array of lecture progress objects (ILectureProgress) for the user. Defaults to an empty array.
 * @param totalLecturesInCourse - Total number of lectures in the course. Defaults to 0.
 * @returns The calculated progress percentage (integer between 0 and 100).
 */
export function calculateProgress(
  quizzes: IQuizProgress[] = [],
  assignments: IAssignmentProgress[] = [],
  lectures: ILectureProgress[] = [],
  totalLecturesInCourse: number = 0
): number {

  let totalScore = 0;
  let totalMaxScore = 0;
  let watchedLecturesCount = 0;

  // --- Calculate Quiz/Assignment Score Component ---
  quizzes.forEach(quiz => {
    if (quiz.status === 'graded' && typeof quiz.score === 'number' && typeof quiz.maxScore === 'number' && quiz.maxScore > 0) {
      totalScore += quiz.score;
      totalMaxScore += quiz.maxScore;
    }
  });

  assignments.forEach(assignment => {
    if (assignment.status === 'graded' && typeof assignment.score === 'number' && typeof assignment.maxScore === 'number' && assignment.maxScore > 0) {
      totalScore += assignment.score;
      totalMaxScore += assignment.maxScore;
    }
  });

  const quizAssignmentPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
  const hasQuizAssignmentComponent = totalMaxScore > 0;

  // --- Calculate Lecture Completion Component ---
  lectures.forEach(lecture => {
    if (lecture.status === 'watched') {
      watchedLecturesCount++;
    }
  });

  const lecturePercentage = totalLecturesInCourse > 0 ? (watchedLecturesCount / totalLecturesInCourse) * 100 : 0;
  const hasLectureComponent = totalLecturesInCourse > 0;

  // --- Combine Components ---
  let finalPercentage = 0;
  let componentCount = 0;

  if (hasQuizAssignmentComponent) {
    finalPercentage += quizAssignmentPercentage;
    componentCount++;
  }
  if (hasLectureComponent) {
    finalPercentage += lecturePercentage;
    componentCount++;
  }

  // Average the percentages of the available components
  if (componentCount > 0) {
    finalPercentage /= componentCount;
  }

  // Clamp between 0 and 100 and round
  const result = Math.round(Math.max(0, Math.min(100, finalPercentage)));

  return result;
}