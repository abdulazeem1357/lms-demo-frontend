import courses from '../../mocks/courses.mock.json';
import courseDetails from '../../mocks/courseDetails.mock.json';
import courseMaterials from '../../mocks/courseMaterials.mock.json';
import lectures from '../../mocks/lectures.mock.json';
import liveLectures from '../../mocks/liveLectures.mock.json';
import quizzes from '../../mocks/quizzes.mock.json';
import assignments from '../../mocks/assignments.mock.json';
import {
  ICourse,
  ICourseListResponse,
  ICourseDetailResponse,
  IModule,
  ICourseStructureResponse,
  ICourseMaterial,
  ICourseMaterialListResponse,
  ILecture,
  ILiveLecture,
  IQuiz,
  IAssignment
} from '../types/course.types';
import { IPagination, IUser } from '../types/user.types';

function findCourseById(courseId: string): ICourse | undefined {
  return (courses as ICourse[]).find(c => c.id === courseId);
}

function getModulesByCourseId(courseId: string): IModule[] {
  return (courseDetails as Record<string, IModule[]>)[courseId] || [];
}

function getMaterialsByCourseId(courseId: string): ICourseMaterial[] {
  return (courseMaterials as ICourseMaterial[]);
}

export async function getCourses(params?: Partial<Pick<IPagination, 'page' | 'limit'>> & { search?: string; category?: string; difficulty?: string }): Promise<ICourseListResponse> {
  return Promise.resolve({
    data: courses as ICourse[],
    meta: {
      page: 1,
      limit: (courses as ICourse[]).length,
      totalItems: (courses as ICourse[]).length,
      totalPages: 1,
    }
  });
}

export async function getCourseById(courseId: string): Promise<ICourse> {
  const course = findCourseById(courseId);
  if (!course) throw new Error('Course not found');
  return Promise.resolve(course);
}

export async function getCourseModules(courseId: string): Promise<IModule[]> {
  return Promise.resolve(getModulesByCourseId(courseId));
}

export async function getCourseMaterials(courseId: string): Promise<ICourseMaterial[]> {
  return Promise.resolve(getMaterialsByCourseId(courseId));
}

export async function createCourse(): Promise<ICourse> {
  throw new Error('Not implemented in mock');
}
export async function updateCourse(): Promise<ICourse> {
  throw new Error('Not implemented in mock');
}
export async function deleteCourse(): Promise<void> {
  return Promise.resolve();
}
export async function createCourseModule(): Promise<IModule> {
  throw new Error('Not implemented in mock');
}
export async function updateCourseModule(): Promise<IModule> {
  throw new Error('Not implemented in mock');
}
export async function deleteCourseModule(): Promise<void> {
  return Promise.resolve();
}
export async function addCourseMaterial(): Promise<ICourseMaterial> {
  throw new Error('Not implemented in mock');
}
export async function updateCourseMaterial(): Promise<ICourseMaterial> {
  throw new Error('Not implemented in mock');
}
export async function deleteCourseMaterial(): Promise<void> {
  return Promise.resolve();
}
export async function getCourseEnrollments(): Promise<Array<{ enrollmentId: string; student: Pick<IUser, 'id' | 'username' | 'firstName' | 'lastName'>; enrolledAt: string }>> {
  return Promise.resolve([]);
}

// --- Lectures ---
export async function getModuleLectures(moduleId: string): Promise<ILecture[]> {
  return Promise.resolve((lectures as ILecture[]).filter(l => l.moduleId === moduleId));
}

export async function createModuleLecture(moduleId: string, payload: Omit<ILecture, 'id' | 'createdAt'>): Promise<ILecture> {
  const newLecture: ILecture = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    moduleId,
    bunnyVideoId: payload.bunnyVideoId,
    title: payload.title,
    description: payload.description,
    duration: payload.duration,
    createdAt: new Date().toISOString(),
  };
  return Promise.resolve(newLecture);
}

export async function updateLecture(lectureId: string, payload: Partial<Omit<ILecture, 'id' | 'moduleId' | 'bunnyVideoId' | 'createdAt'>>): Promise<ILecture> {
  const lecture = (lectures as ILecture[]).find(l => l.id === lectureId);
  if (!lecture) throw new Error('Lecture not found');
  return Promise.resolve({ ...lecture, ...payload });
}

export async function deleteLecture(_lectureId: string): Promise<void> {
  return Promise.resolve();
}

// --- Live Lectures ---
export async function getCourseLiveLectures(courseId: string): Promise<ILiveLecture[]> {
  // For mock, return all live lectures (or filter by courseId if your mock supports it)
  return Promise.resolve(liveLectures as ILiveLecture[]);
}

export async function createCourseLiveLecture(courseId: string, payload: Omit<ILiveLecture, 'id'>): Promise<ILiveLecture> {
  const newLiveLecture: ILiveLecture = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    ...payload,
  };
  return Promise.resolve(newLiveLecture);
}

export async function updateCourseLiveLecture(courseId: string, liveLectureId: string, payload: Partial<Omit<ILiveLecture, 'id'>>): Promise<ILiveLecture> {
  const lecture = (liveLectures as ILiveLecture[]).find(l => l.id === liveLectureId);
  if (!lecture) throw new Error('Live lecture not found');
  return Promise.resolve({ ...lecture, ...payload });
}

export async function deleteCourseLiveLecture(courseId: string, liveLectureId: string): Promise<void> {
  return Promise.resolve();
}

// --- Quizzes ---
export async function getModuleQuizzes(moduleId: string): Promise<IQuiz[]> {
  return Promise.resolve((quizzes as IQuiz[]).filter(q => q.moduleId === moduleId));
}

export async function createModuleQuiz(moduleId: string, payload: Omit<IQuiz, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IQuiz> {
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
  const quiz = (quizzes as IQuiz[]).find(q => q.id === quizId);
  if (!quiz) throw new Error('Quiz not found');
  return Promise.resolve({ ...quiz, ...payload, updatedAt: new Date().toISOString() });
}

export async function deleteQuiz(_quizId: string): Promise<void> {
  return Promise.resolve();
}

// --- Assignments ---
export async function getModuleAssignments(moduleId: string): Promise<IAssignment[]> {
  return Promise.resolve((assignments as IAssignment[]).filter(a => a.moduleId === moduleId));
}

export async function createModuleAssignment(moduleId: string, payload: Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>): Promise<IAssignment> {
  const newAssignment: IAssignment = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    moduleId,
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(newAssignment);
}

export async function updateAssignment(assignmentId: string, payload: Partial<Omit<IAssignment, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>): Promise<IAssignment> {
  const assignment = (assignments as IAssignment[]).find(a => a.id === assignmentId);
  if (!assignment) throw new Error('Assignment not found');
  return Promise.resolve({ ...assignment, ...payload, updatedAt: new Date().toISOString() });
}

export async function deleteAssignment(_assignmentId: string): Promise<void> {
  return Promise.resolve();
}
