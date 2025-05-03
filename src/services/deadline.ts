import * as real from './deadline.service';
import * as mock from './deadline.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getUpcomingDeadlines = useMocks ? mock.getUpcomingDeadlines : real.getUpcomingDeadlines;
export const getCourseDeadlines = useMocks ? mock.getCourseDeadlines : real.getCourseDeadlines;
export const getModuleDeadlines = useMocks ? mock.getModuleDeadlines : real.getModuleDeadlines;