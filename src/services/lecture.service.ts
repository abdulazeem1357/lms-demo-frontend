import { apiClient } from '../api/client';
import {
  ILecture,
  ILectureListResponse,
  ILectureDetailResponse,
  ILiveLecture,
  ILiveLectureListResponse,
  ILiveLectureDetailResponse
} from '../types/course.types';

/**
 * Fetches all pre-recorded lectures for a module.
 */
export async function getModuleLectures(moduleId: string): Promise<ILecture[]> {
  const { data } = await apiClient.get<ILectureListResponse>(`/modules/${moduleId}/lectures`);
  return data.data;
}

/**
 * Fetches details of a single pre-recorded lecture.
 */
export async function getLectureById(lectureId: string): Promise<ILecture> {
  const { data } = await apiClient.get<ILectureDetailResponse>(`/lectures/${lectureId}`);
  return data.data;
}

/**
 * Creates a new pre-recorded lecture in a module.
 */
export async function createModuleLecture(moduleId: string, payload: Omit<ILecture, 'id' | 'moduleId' | 'createdAt'>): Promise<ILecture> {
  const { data } = await apiClient.post<ILectureDetailResponse>(`/modules/${moduleId}/lectures`, payload);
  return data.data;
}

/**
 * Updates an existing pre-recorded lecture.
 */
export async function updateLecture(lectureId: string, payload: Partial<Omit<ILecture, 'id' | 'moduleId' | 'bunnyVideoId' | 'createdAt'>>): Promise<ILecture> {
  const { data } = await apiClient.put<ILectureDetailResponse>(`/lectures/${lectureId}`, payload);
  return data.data;
}

/**
 * Deletes a pre-recorded lecture by ID.
 */
export async function deleteLecture(lectureId: string): Promise<void> {
  await apiClient.delete(`/lectures/${lectureId}`);
}

/**
 * Fetches all live lectures for a course.
 */
export async function getCourseLiveLectures(courseId: string): Promise<ILiveLecture[]> {
  const { data } = await apiClient.get<ILiveLectureListResponse>(`/courses/${courseId}/live-lectures`);
  return data.data;
}

/**
 * Schedules a new live lecture for a course.
 */
export async function createCourseLiveLecture(courseId: string, payload: Omit<ILiveLecture, 'id'>): Promise<ILiveLecture> {
  const { data } = await apiClient.post<ILiveLectureDetailResponse>(`/courses/${courseId}/live-lectures`, payload);
  return data.data;
}

/**
 * Updates an existing live lecture for a course.
 */
export async function updateCourseLiveLecture(courseId: string, liveLectureId: string, payload: Partial<Omit<ILiveLecture, 'id'>>): Promise<ILiveLecture> {
  const { data } = await apiClient.put<ILiveLectureDetailResponse>(`/courses/${courseId}/live-lectures/${liveLectureId}`, payload);
  return data.data;
}

/**
 * Deletes a scheduled live lecture from a course.
 */
export async function deleteCourseLiveLecture(courseId: string, liveLectureId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/live-lectures/${liveLectureId}`);
}
