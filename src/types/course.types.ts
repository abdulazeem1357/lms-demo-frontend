import { IPagination } from './user.types';

/**
 * Core course information.
 */
export interface ICourse {
  id: string;               // UUID
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}

/**
 * Response when fetching a list of courses.
 */
export interface ICourseListResponse {
  data: ICourse[];
  meta: IPagination;
}

/**
 * Response when fetching a single course.
 */
export interface ICourseDetailResponse {
  data: ICourse;
}

/**
 * Chapter within a module.
 */
export interface IChapter {
  id: string;               // UUID
  title: string;
  order: number;
}

/**
 * Module within a course, containing chapters.
 */
export interface IModule {
  id: string;               // UUID
  title: string;
  order: number;
  chapters: IChapter[];
}

/**
 * Response when fetching course structure (modules).
 */
export interface ICourseStructureResponse {
  data: IModule[];
}

/**
 * Pre-recorded lecture record.
 */
export interface ILecture {
  id: string;               // UUID
  moduleId: string;
  bunnyVideoId: string;
  title: string;
  description?: string;
  duration: number;         // seconds
  createdAt: string;        // ISO 8601
}

export interface ILectureListResponse {
  data: ILecture[];
}

export interface ILectureDetailResponse {
  data: ILecture;
}

/**
 * Scheduled live lecture.
 */
export interface ILiveLecture {
  id: string;               // UUID
  topic: string;
  meetingUrl: string;
  startTime: string;        // ISO 8601
  endTime: string;          // ISO 8601
}

export interface ILiveLectureListResponse {
  data: ILiveLecture[];
}

export interface ILiveLectureDetailResponse {
  data: ILiveLecture;
}

/**
 * Quiz summary.
 */
export interface IQuiz {
  id: string;               // UUID
  moduleId: string;
  title: string;
  description?: string;
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}

export interface IQuizListResponse {
  data: IQuiz[];
}

/**
 * Assignment summary.
 */
export interface IAssignment {
  id: string;               // UUID
  moduleId: string;
  title: string;
  description?: string;
  dueDate: string;          // ISO 8601
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}

export interface IAssignmentListResponse {
  data: IAssignment[];
}

/**
 * Supplementary course material.
 */
export interface ICourseMaterial {
  id: string;               // UUID
  title: string;
  description?: string;
  type: 'file' | 'link';
  url: string;
  createdAt: string;        // ISO 8601
}

export interface ICourseMaterialListResponse {
  data: ICourseMaterial[];
}