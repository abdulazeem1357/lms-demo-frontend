import { apiClient } from '../api/client';
import {
  INotificationHistoryResponse,
  INotificationDetailResponse,
  INotificationSendRequest,
  INotificationSendResponse,
  IScheduledNotificationsResponse
} from '../types/communication.types';
import { IPagination } from '../types/user.types';

/**
 * Fetches notification history with optional filters and pagination.
 */
export async function getNotificationHistory(params?: Partial<Pick<IPagination, 'page' | 'limit'>> & {
  channel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<INotificationHistoryResponse> {
  const { data } = await apiClient.get<INotificationHistoryResponse>('/notifications/history', { params });
  return data;
}

/**
 * Fetches detailed information for a specific notification by ID.
 */
export async function getNotificationDetail(notificationId: string): Promise<INotificationDetailResponse> {
  const { data } = await apiClient.get<INotificationDetailResponse>(`/notifications/${notificationId}`);
  return data;
}

/**
 * Sends or schedules a notification.
 */
export async function sendNotification(payload: INotificationSendRequest): Promise<INotificationSendResponse> {
  const { data } = await apiClient.post<INotificationSendResponse>('/notifications', payload);
  return data;
}

/**
 * Fetches all scheduled notifications.
 */
export async function getScheduledNotifications(): Promise<IScheduledNotificationsResponse> {
  const { data } = await apiClient.get<IScheduledNotificationsResponse>('/notifications/scheduled');
  return data;
}

/**
 * Cancels a scheduled notification by ID.
 */
export async function cancelScheduledNotification(notificationId: string): Promise<void> {
  await apiClient.delete(`/notifications/scheduled/${notificationId}`);
}
