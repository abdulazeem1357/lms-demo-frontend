import * as real from './lecture.service';
import * as mock from './lecture.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getModuleLectures = useMocks ? mock.getModuleLectures : real.getModuleLectures;
export const getLectureById = useMocks ? mock.getLectureById : real.getLectureById;
export const createModuleLecture = useMocks ? mock.createModuleLecture : real.createModuleLecture;
export const updateLecture = useMocks ? mock.updateLecture : real.updateLecture;
export const deleteLecture = useMocks ? mock.deleteLecture : real.deleteLecture;
export const getCourseLiveLectures = useMocks ? mock.getCourseLiveLectures : real.getCourseLiveLectures;
export const createCourseLiveLecture = useMocks ? mock.createCourseLiveLecture : real.createCourseLiveLecture;
export const updateCourseLiveLecture = useMocks ? mock.updateCourseLiveLecture : real.updateCourseLiveLecture;
export const deleteCourseLiveLecture = useMocks ? mock.deleteCourseLiveLecture : real.deleteCourseLiveLecture;
