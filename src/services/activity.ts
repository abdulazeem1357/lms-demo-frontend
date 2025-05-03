import * as real from './activity.service';
import * as mock from './activity.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getUserActivity = useMocks ? mock.getUserActivity : real.getUserActivity;
export const getActivityById = useMocks ? mock.getActivityById : real.getActivityById;