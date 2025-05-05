import * as real from './course.service';
import * as mock from './course.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getCourses = useMocks ? mock.getCourses : real.getCourses;
export const getCourseById = useMocks ? mock.getCourseById : real.getCourseById;
export const createCourse = useMocks ? mock.createCourse : real.createCourse;
export const updateCourse = useMocks ? mock.updateCourse : real.updateCourse;
export const deleteCourse = useMocks ? mock.deleteCourse : real.deleteCourse;
export const getCourseModules = useMocks ? mock.getCourseModules : real.getCourseModules;
export const createCourseModule = useMocks ? mock.createCourseModule : real.createCourseModule;
export const updateCourseModule = useMocks ? mock.updateCourseModule : real.updateCourseModule;
export const deleteCourseModule = useMocks ? mock.deleteCourseModule : real.deleteCourseModule;

// Add getCourseLectures export
export const getCourseLectures = useMocks ? mock.getCourseLectures : real.getCourseLectures;

export const getModuleLectures = useMocks ? mock.getModuleLectures : real.getModuleLectures;
export const createModuleLecture = useMocks ? mock.createModuleLecture : real.createModuleLecture;
export const updateLecture = useMocks ? mock.updateLecture : real.updateLecture;
export const deleteLecture = useMocks ? mock.deleteLecture : real.deleteLecture;
export const getCourseMaterials = useMocks ? mock.getCourseMaterials : real.getCourseMaterials;
export const addCourseMaterial = useMocks ? mock.addCourseMaterial : real.addCourseMaterial;
export const updateCourseMaterial = useMocks ? mock.updateCourseMaterial : real.updateCourseMaterial;
export const deleteCourseMaterial = useMocks ? mock.deleteCourseMaterial : real.deleteCourseMaterial;
export const getCourseEnrollments = useMocks ? mock.getCourseEnrollments : real.getCourseEnrollments;
