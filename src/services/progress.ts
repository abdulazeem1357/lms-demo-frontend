import * as real from './progress.service';
import * as mock from './progress.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getUserOverallProgress = useMocks ? mock.getUserOverallProgress : real.getUserOverallProgress;
export const getUserCourseProgress = useMocks ? mock.getUserCourseProgress : real.getUserCourseProgress;
