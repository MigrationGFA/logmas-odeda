/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../lib/api";

// Types based on your controller
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  data?: any;
}

export interface NotificationsResponse {
  items: Notification[];
  unreadCount: number;
  page: number;
  limit: number;
}

export interface SendNotificationData {
  userId: string;
  to: {
    phone?: string;
    email?: string;
  };
  templateKey: string;
  vars: Record<string, any>;
  channels: ('sms' | 'email' | 'inapp')[];
}

export interface SendNotificationResponse {
  success: boolean;
  data: {
    sms?: { sent: boolean; messageId?: string };
    email?: { sent: boolean; messageId?: string };
    inapp?: { sent: boolean; notificationId?: string };
  };
}

// Service functions
export const notificationsService = {
  // Get my notifications with pagination
  getMyNotifications: (params?: { page?: number; limit?: number }) =>
    api.get<NotificationsResponse>("/notifications", { params }),
  
  // Mark a single notification as read
  markNotificationRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllNotificationsRead: () =>
    api.patch<{ message: string }>("/notifications/read-all"),
  
  // Send a notification (admin/internal use)
  sendNotification: (data: SendNotificationData) =>
    api.post<SendNotificationResponse>("/notifications/send", data),
};