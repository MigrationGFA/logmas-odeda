import { api } from "@/lib/api";
import { MOCK_MODE, tick } from "./_mock";
import {
  markNotificationRead as storeMarkRead,
  markAllNotificationsRead as storeMarkAllRead,
  getStoreSnapshot,
  type Notification as StoreNotification,
} from "@/lib/store";

export type Notification = StoreNotification;

export const notificationsService = {
  list: async (): Promise<Notification[]> => {
    if (MOCK_MODE) return tick(getStoreSnapshot().notifications);
    return api.get<Notification[]>("/notifications");
  },

  markRead: async (id: string): Promise<void> => {
    if (MOCK_MODE) {
      storeMarkRead(id);
      return tick(undefined as unknown as void);
    }
    return api.post<void>(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    if (MOCK_MODE) {
      storeMarkAllRead();
      return tick(undefined as unknown as void);
    }
    return api.post<void>("/notifications/read-all");
  },
};
