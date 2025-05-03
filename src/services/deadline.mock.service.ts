import assignments from '../../mocks/assignments.mock.json';
import quizzes from '../../mocks/quizzes.mock.json';
import liveLectures from '../../mocks/liveLectures.mock.json';
import courses from '../../mocks/courses.mock.json';
import { IDeadline, IDeadlineParams } from '../types/deadline.types';

interface IMockModule {
  id: string;
  title: string;
}

interface IMockCourse {
  id: string;
  title: string;
  modules?: IMockModule[];
}

interface IMockAssignment {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface IMockQuiz {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface IMockLiveLecture {
  id: string;
  topic: string;
  meetingUrl: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper: Create deadline from assignment
function createDeadlineFromAssignment(assignment: IMockAssignment, course: IMockCourse): IDeadline {
  return {
    id: assignment.id,
    type: 'assignment',
    title: assignment.title,
    description: assignment.description,
    courseId: course.id,
    courseName: course.title,
    moduleId: assignment.moduleId,
    dueDate: assignment.dueDate,
    url: `/courses/${course.id}/assignments/${assignment.id}`,
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt
  };
}

// Helper: Create deadline from quiz
function createDeadlineFromQuiz(quiz: IMockQuiz, course: IMockCourse): IDeadline {
  return {
    id: quiz.id,
    type: 'quiz',
    title: quiz.title,
    description: quiz.description,
    courseId: course.id,
    courseName: course.title,
    moduleId: quiz.moduleId,
    dueDate: quiz.dueDate,
    url: `/courses/${course.id}/quizzes/${quiz.id}`,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt
  };
}

// Helper: Create deadline from live lecture
function createDeadlineFromLiveLecture(lecture: IMockLiveLecture, course: IMockCourse): IDeadline {
  return {
    id: lecture.id,
    type: 'live-lecture',
    title: lecture.topic,
    courseId: course.id,
    courseName: course.title,
    dueDate: lecture.startTime,
    url: `/courses/${course.id}/live/${lecture.id}`,
    createdAt: lecture.createdAt || new Date().toISOString(),
    updatedAt: lecture.updatedAt || new Date().toISOString()
  };
}

/**
 * Returns all upcoming deadlines for the authenticated user.
 */
export async function getUpcomingDeadlines(params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const limit = params.limit || 10;

  // Get all deadlines from different sources
  const deadlines: IDeadline[] = [];

  // Convert assignments to deadlines
  (assignments as IMockAssignment[]).forEach(assignment => {
    const course = (courses as IMockCourse[]).find(c => {
      const modules = c.modules || [];
      return modules.some((m: IMockModule) => m.id === assignment.moduleId);
    });
    if (course) {
      deadlines.push(createDeadlineFromAssignment(assignment, course));
    }
  });

  // Convert quizzes to deadlines
  (quizzes as IMockQuiz[]).forEach(quiz => {
    const course = (courses as IMockCourse[]).find(c => {
      const modules = c.modules || [];
      return modules.some((m: IMockModule) => m.id === quiz.moduleId);
    });
    if (course) {
      deadlines.push(createDeadlineFromQuiz(quiz, course));
    }
  });

  // For live lectures, we'll associate them with the first course as a demo
  // In a real implementation, this would be handled by proper course associations
  const defaultCourse = (courses as IMockCourse[])[0];
  if (defaultCourse) {
    (liveLectures as unknown as IMockLiveLecture[]).forEach(lecture => {
      deadlines.push(createDeadlineFromLiveLecture(lecture, defaultCourse));
    });
  }

  // Filter by date range if specified
  let filteredDeadlines = deadlines;
  if (params.startDate) {
    filteredDeadlines = filteredDeadlines.filter(d => 
      new Date(d.dueDate) >= new Date(params.startDate!)
    );
  }
  if (params.endDate) {
    filteredDeadlines = filteredDeadlines.filter(d => 
      new Date(d.dueDate) <= new Date(params.endDate!)
    );
  }

  // Filter by course if specified
  if (params.courseId) {
    filteredDeadlines = filteredDeadlines.filter(d => d.courseId === params.courseId);
  }

  // Filter by module if specified
  if (params.moduleId) {
    filteredDeadlines = filteredDeadlines.filter(d => d.moduleId === params.moduleId);
  }

  // Filter by type if specified
  if (params.type) {
    filteredDeadlines = filteredDeadlines.filter(d => d.type === params.type);
  }

  // Sort by due date (ascending)
  filteredDeadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Return limited results
  return filteredDeadlines.slice(0, limit);
}

/**
 * Returns all deadlines for a specific course.
 */
export async function getCourseDeadlines(courseId: string, params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const allDeadlines = await getUpcomingDeadlines(params);
  return allDeadlines.filter(d => d.courseId === courseId);
}

/**
 * Returns all deadlines for a specific module.
 */
export async function getModuleDeadlines(moduleId: string, params: IDeadlineParams = {}): Promise<IDeadline[]> {
  const allDeadlines = await getUpcomingDeadlines(params);
  return allDeadlines.filter(d => d.moduleId === moduleId);
}