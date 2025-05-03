import * as real from './analytics.service';
import * as mock from './analytics.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getEngagementStats = useMocks ? mock.getEngagementStats : real.getEngagementStats;