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
  description: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  timeLimit: number;
  questions: Array<{
    id: string;
    quizId: string;
    type: string;
    text: string;
    options: Array<any>;
    order: number;
  }>;
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

// Import mock data with proper typing
const mockAssignments = assignments as IMockAssignment[];
const mockQuizzes = quizzes as IMockQuiz[];
const mockLiveLectures = liveLectures as IMockLiveLecture[];
const mockCourses = courses as IMockCourse[];

// Helper: Find course by moduleId
function findCourseByModuleId(moduleId: string): IMockCourse | undefined {
  return mockCourses.find(c => 
    (c.modules || []).some(m => m.id === moduleId)
  );
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
  // Calculate due date as 7 days from creation for mock data
  const dueDate = new Date(quiz.createdAt);
  dueDate.setDate(dueDate.getDate() + 7);

  return {
    id: quiz.id,
    type: 'quiz',
    title: quiz.title,
    description: quiz.description,
    courseId: course.id,
    courseName: course.title,
    moduleId: quiz.moduleId,
    dueDate: dueDate.toISOString(),
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
  const deadlines: IDeadline[] = [];

  // Convert assignments to deadlines
  mockAssignments.forEach(assignment => {
    const course = findCourseByModuleId(assignment.moduleId);
    if (course) {
      deadlines.push(createDeadlineFromAssignment(assignment, course));
    }
  });

  // Convert quizzes to deadlines
  mockQuizzes.forEach(quiz => {
    const course = findCourseByModuleId(quiz.moduleId);
    if (course) {
      deadlines.push(createDeadlineFromQuiz(quiz, course));
    }
  });

  // Associate live lectures with their proper courses
  // In a real implementation, live lectures would have courseId
  mockLiveLectures.forEach(lecture => {
    // For demo purposes, distribute live lectures across available courses
    const courseIndex = Math.floor(Math.random() * mockCourses.length);
    const course = mockCourses[courseIndex];
    if (course) {
      deadlines.push(createDeadlineFromLiveLecture(lecture, course));
    }
  });

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