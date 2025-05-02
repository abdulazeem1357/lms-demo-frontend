import notifications from '../../mocks/notifications.mock.json';
import { 
  INotificationHistoryResponse,
  INotificationDetail,
  INotificationDetailResponse,
  INotificationSendRequest,
  INotificationSendResponse,
  IScheduledNotificationsResponse,
  NotificationChannel,
  NotificationStatus,
  INotificationDetailChannel
} from '../types/communication.types';
import { IPagination } from '../types/user.types';

/**
 * Returns mock notification history with optional filters and pagination
 */
export async function getNotificationHistory(params?: Partial<Pick<IPagination, 'page' | 'limit'>> & {
  channel?: NotificationChannel;
  status?: NotificationStatus;
  startDate?: string;
  endDate?: string;
}): Promise<INotificationHistoryResponse> {
  const limit = params?.limit || 10;
  const page = params?.page || 1;
  const totalItems = (notifications.history || []).length;

  const items = (notifications.history || []).map(item => ({
    ...item,
    channels: item.channels as NotificationChannel[],
    status: item.status as NotificationStatus
  }));

  return Promise.resolve({
    data: items.slice((page - 1) * limit, page * limit),
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  });
}

/**
 * Returns detailed information for a specific notification
 */
export async function getNotificationDetail(notificationId: string): Promise<INotificationDetailResponse> {
  const detail = (notifications.details || []).find(n => n.notificationId === notificationId);
  if (!detail) {
    throw new Error('Notification not found');
  }

  const notificationDetail: INotificationDetail = {
    notificationId: detail.notificationId,
    message: detail.message,
    audience: detail.audience,
    channels: detail.channels.map(c => {
      const channel: INotificationDetailChannel = {
        type: c.type as NotificationChannel,
        status: c.status as NotificationStatus,
        sentAt: c.sentAt
      };

      // Only add optional properties if they exist in mock data
      if ('deliveredAt' in c) {
        channel.deliveredAt = c.deliveredAt;
      }
      if ('error' in c) {
        channel.error = c.error;
      }

      return channel;
    })
  };

  return Promise.resolve(notificationDetail);
}

/**
 * Mock implementation for sending or scheduling a notification
 */
export async function sendNotification(payload: INotificationSendRequest): Promise<INotificationSendResponse> {
  const isScheduled = Boolean(payload.scheduleTime);
  const notificationId = `mock-${Math.random().toString(36).slice(2)}`;

  return Promise.resolve({
    notificationId,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledTime: payload.scheduleTime
  });
}

/**
 * Returns mock list of scheduled notifications
 */
export async function getScheduledNotifications(): Promise<IScheduledNotificationsResponse> {
  // Since mock data doesn't have scheduled notifications, return empty array
  return Promise.resolve({
    data: []
  });
}

/**
 * Mock implementation for cancelling a scheduled notification
 */
export async function cancelScheduledNotification(_notificationId: string): Promise<void> {
  return Promise.resolve();
}