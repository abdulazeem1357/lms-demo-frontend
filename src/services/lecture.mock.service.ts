import lectures from '../../mocks/lectures.mock.json';
import liveLectures from '../../mocks/liveLectures.mock.json';
import { ILecture, ILiveLecture } from '../types/course.types';

export async function getModuleLectures(moduleId: string): Promise<ILecture[]> {
  return Promise.resolve((lectures as ILecture[]).filter(l => l.moduleId === moduleId));
}

export async function getLectureById(lectureId: string): Promise<ILecture> {
  const lecture = (lectures as ILecture[]).find(l => l.id === lectureId);
  if (!lecture) throw new Error('Lecture not found');
  return Promise.resolve(lecture);
}

export async function createModuleLecture(moduleId: string, payload: Omit<ILecture, 'id' | 'moduleId' | 'createdAt'>): Promise<ILecture> {
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

export async function getCourseLiveLectures(_courseId: string): Promise<ILiveLecture[]> {
  return Promise.resolve(liveLectures as ILiveLecture[]);
}

export async function createCourseLiveLecture(_courseId: string, payload: Omit<ILiveLecture, 'id'>): Promise<ILiveLecture> {
  const newLiveLecture: ILiveLecture = {
    id: `mock-${Math.random().toString(36).slice(2)}`,
    ...payload,
  };
  return Promise.resolve(newLiveLecture);
}

export async function updateCourseLiveLecture(_courseId: string, liveLectureId: string, payload: Partial<Omit<ILiveLecture, 'id'>>): Promise<ILiveLecture> {
  const lecture = (liveLectures as ILiveLecture[]).find(l => l.id === liveLectureId);
  if (!lecture) throw new Error('Live lecture not found');
  return Promise.resolve({ ...lecture, ...payload });
}

export async function deleteCourseLiveLecture(_courseId: string, _liveLectureId: string): Promise<void> {
  return Promise.resolve();
}
