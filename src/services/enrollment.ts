import * as real from './enrollment.service';
import * as mock from './enrollment.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getUserEnrollments = useMocks ? mock.getUserEnrollments : real.getUserEnrollments;
export const enrollUserInCourse = useMocks ? mock.enrollUserInCourse : real.enrollUserInCourse;
export const unenrollUserFromCourse = useMocks ? mock.unenrollUserFromCourse : real.unenrollUserFromCourse;
export const getCourseEnrollments = useMocks ? mock.getCourseEnrollments : real.getCourseEnrollments;
