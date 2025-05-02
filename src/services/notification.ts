import * as real from './notification.service';
import * as mock from './notification.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getNotificationHistory = useMocks ? mock.getNotificationHistory : real.getNotificationHistory;
export const getNotificationDetail = useMocks ? mock.getNotificationDetail : real.getNotificationDetail;
export const sendNotification = useMocks ? mock.sendNotification : real.sendNotification;
export const getScheduledNotifications = useMocks ? mock.getScheduledNotifications : real.getScheduledNotifications;
export const cancelScheduledNotification = useMocks ? mock.cancelScheduledNotification : real.cancelScheduledNotification;
