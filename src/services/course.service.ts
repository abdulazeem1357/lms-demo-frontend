import { apiClient } from '../api/client';
import {
  ICourse,
  ICourseListResponse,
  ICourseDetailResponse,
  IModule,
  ICourseStructureResponse,
  ILecture,
  ILectureListResponse,
  ILectureDetailResponse,
  ILiveLecture,
  ILiveLectureListResponse,
  ILiveLectureDetailResponse,
  IQuiz,
  IQuizListResponse,
  IAssignment,
  IAssignmentListResponse,
  ICourseMaterial,
  ICourseMaterialListResponse
} from '../types/course.types';
import { IPagination, IUser } from '../types/user.types';

/**
 * Fetches a paginated list of courses with optional filters.
 */
export async function getCourses(params?: Partial<Pick<IPagination, 'page' | 'limit'>> & { search?: string; category?: string; difficulty?: string }): Promise<ICourseListResponse> {
  const { data } = await apiClient.get<ICourseListResponse>('/courses', { params });
  return data;
}

/**
 * Fetches a single course by ID.
 */
export async function getCourseById(courseId: string): Promise<ICourse> {
  const { data } = await apiClient.get<ICourseDetailResponse>(`/courses/${courseId}`);
  return data.data;
}

/**
 * Creates a new course.
 */
export async function createCourse(payload: Omit<ICourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICourse> {
  const { data } = await apiClient.post<ICourseDetailResponse>('/courses', payload);
  return data.data;
}

/**
 * Updates an existing course.
 */
export async function updateCourse(courseId: string, payload: Partial<Omit<ICourse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ICourse> {
  const { data } = await apiClient.put<ICourseDetailResponse>(`/courses/${courseId}`, payload);
  return data.data;
}

/**
 * Deletes a course by ID.
 */
export async function deleteCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}`);
}

/**
 * Fetches modules (with chapters) for a course.
 */
export async function getCourseModules(courseId: string): Promise<IModule[]> {
  const { data } = await apiClient.get<ICourseStructureResponse>(`/courses/${courseId}/modules`);
  return data.data;
}

/**
 * Creates a new module in a course.
 */
export async function createCourseModule(courseId: string, payload: Omit<IModule, 'id' | 'chapters'> & { chapters?: Array<Omit<IModule['chapters'][number], 'id'>> }): Promise<IModule> {
  const { data } = await apiClient.post<{ data: IModule }>(`/courses/${courseId}/modules`, payload);
  return data.data;
}

/**
 * Updates a module in a course.
 */
export async function updateCourseModule(courseId: string, moduleId: string, payload: Partial<Omit<IModule, 'id'>>): Promise<IModule> {
  const { data } = await apiClient.put<{ data: IModule }>(`/courses/${courseId}/modules/${moduleId}`, payload);
  return data.data;
}

/**
 * Deletes a module from a course.
 */
export async function deleteCourseModule(courseId: string, moduleId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
}

/**
 * Fetches all pre-recorded lectures for a specific course.
 * @param courseId - The ID of the course.
 * @returns A promise resolving to the list of lectures for the course.
 */
export async function getCourseLectures(courseId: string): Promise<ILectureListResponse> {
  const { data } = await apiClient.get<ILectureListResponse>(`/courses/${courseId}/lectures`);
  return data;
}

/**
 * Fetches pre-recorded lectures for a module.
 */
export async function getModuleLectures(moduleId: string): Promise<ILecture[]> {
  const { data } = await apiClient.get<ILectureListResponse>(`/modules/${moduleId}/lectures`);
  return data.data;
}

/**
 * Creates a new pre-recorded lecture in a module.
 */
export async function createModuleLecture(moduleId: string, payload: Omit<ILecture, 'id' | 'createdAt'>): Promise<ILecture> {
  const { data } = await apiClient.post<{ data: ILecture }>(`/modules/${moduleId}/lectures`, payload);
  return data.data;
}

/**
 * Updates a lecture by ID.
 */
export async function updateLecture(lectureId: string, payload: Partial<Omit<ILecture, 'id' | 'moduleId' | 'bunnyVideoId' | 'createdAt'>>): Promise<ILecture> {
  const { data } = await apiClient.put<{ data: ILecture }>(`/lectures/${lectureId}`, payload);
  return data.data;
}

/**
 * Deletes a lecture by ID.
 */
export async function deleteLecture(lectureId: string): Promise<void> {
  await apiClient.delete(`/lectures/${lectureId}`);
}

/**
 * Fetches course materials.
 */
export async function getCourseMaterials(courseId: string): Promise<ICourseMaterial[]> {
  const { data } = await apiClient.get<ICourseMaterialListResponse>(`/courses/${courseId}/materials`);
  return data.data;
}

/**
 * Adds a new material (file or link) to a course.
 * For file uploads, use FormData; for links, use JSON.
 */
export async function addCourseMaterial(courseId: string, payload: FormData | { title: string; description?: string; linkUrl: string }): Promise<ICourseMaterial> {
  let response;
  if (payload instanceof FormData) {
    response = await apiClient.post<ICourseMaterial>(`/courses/${courseId}/materials`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } else {
    const { data } = await apiClient.post<ICourseMaterial>(`/courses/${courseId}/materials`, payload);
    return data;
  }
}

/**
 * Updates a course material by ID.
 */
export async function updateCourseMaterial(courseId: string, materialId: string, payload: Partial<Omit<ICourseMaterial, 'id' | 'createdAt'>>): Promise<ICourseMaterial> {
  const { data } = await apiClient.put<ICourseMaterial>(`/courses/${courseId}/materials/${materialId}`, payload);
  return data;
}

/**
 * Deletes a course material by ID.
 */
export async function deleteCourseMaterial(courseId: string, materialId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/materials/${materialId}`);
}

/**
 * Fetches students enrolled in a course.
 */
export async function getCourseEnrollments(courseId: string): Promise<Array<{ enrollmentId: string; student: Pick<IUser, 'id' | 'username' | 'firstName' | 'lastName'>; enrolledAt: string }>> {
  const { data } = await apiClient.get<{ data: Array<{ enrollmentId: string; student: Pick<IUser, 'id' | 'username' | 'firstName' | 'lastName'>; enrolledAt: string }> }>(`/courses/${courseId}/enrollments`);
  return data.data;
}
