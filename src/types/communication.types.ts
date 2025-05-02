import { IPagination, IApiResponse } from './user.types';

/**
 * Notification delivery channels.
 */
export type NotificationChannel = 'email' | 'in-app';

/**
 * Aggregated notification status.
 */
export type NotificationStatus = 'sent' | 'scheduled' | 'delivered' | 'failed';

/**
 * Item in notification history.
 */
export interface INotificationHistoryItem {
  notificationId: string;
  message: string;
  channels: NotificationChannel[];
  status: NotificationStatus;
  sentAt: string;           // ISO 8601 timestamp
}

/**
 * Response for GET /notifications/history
 */
export interface INotificationHistoryResponse {
  data: INotificationHistoryItem[];
  meta: IPagination;
}

/**
 * Target audience for a notification.
 * Exactly one of the fields should be set.
 */
export interface INotificationAudience {
  all?: boolean;
  courseId?: string;
  userIds?: string[];
}

/**
 * Request payload for sending or scheduling a notification.
 */
export interface INotificationSendRequest {
  audience: INotificationAudience;
  message: string;
  channels: NotificationChannel[];
  scheduleTime?: string;    // ISO 8601 timestamp for scheduled delivery
}

/**
 * Response for POST /notifications
 */
export interface INotificationSendResponse {
  notificationId: string;
  status: 'sent' | 'scheduled';
  scheduledTime?: string;    // Present when scheduled
}

/**
 * Per-channel delivery record in notification detail.
 */
export interface INotificationDetailChannel {
  type: NotificationChannel;
  status: NotificationStatus;
  sentAt: string;           // ISO 8601 timestamp
  deliveredAt?: string;     // ISO 8601 timestamp
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Detailed notification record.
 */
export interface INotificationDetail {
  notificationId: string;
  audience: INotificationAudience;
  message: string;
  channels: INotificationDetailChannel[];
}

/**
 * Response for GET /notifications/{notificationId}
 */
export type INotificationDetailResponse = INotificationDetail;

/**
 * Scheduled notification entry.
 */
export interface IScheduledNotification {
  notificationId: string;
  audience: INotificationAudience;
  message: string;
  channels: NotificationChannel[];
  scheduledTime: string;    // ISO 8601 timestamp
  createdAt: string;        // ISO 8601 timestamp when scheduled
}

/**
 * Response for GET /notifications/scheduled
 */
export type IScheduledNotificationsResponse = IApiResponse<IScheduledNotification[]>;