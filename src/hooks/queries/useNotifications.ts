/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsService, Notification } from "@/services/apiNotifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  my: () => [...notificationKeys.all, "my"] as const,
  list: (params?: { page?: number; limit?: number }) => 
    [...notificationKeys.my(), params] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
};

// Hook for getting notifications
export function useNotifications(params?: { page?: number; limit?: number }) {
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsService.getMyNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });

  const notifications = notificationsData?.items || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  const page = notificationsData?.page || 1;
  const limit = notificationsData?.limit || 20;

  // Mark a notification as read
  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markNotificationRead(id),
    onSuccess: (updatedNotification) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.my() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });

  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: notificationKeys.my() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });

  // Helper: Get unread count only
  const useUnreadCount = () => {
    return useQuery({
      queryKey: notificationKeys.unread(),
      queryFn: async () => {
        const data = await notificationsService.getMyNotifications({ page: 1, limit: 1 });
        return data.unreadCount || 0;
      },
      staleTime: 30 * 1000,
    });
  };

  // Helper: Mark multiple notifications as read
  const markMultipleRead = async (ids: string[]) => {
    const promises = ids.map(id => 
      notificationsService.markNotificationRead(id)
    );
    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: notificationKeys.my() });
    queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
  };

  return {
    // Data
    notifications,
    unreadCount,
    page,
    limit,
    isLoading,
    error,
    refetch,
    
    // Mutations
    markRead: markReadMutation.mutate,
    markReadAsync: markReadMutation.mutateAsync,
    isMarkingRead: markReadMutation.isPending,
    
    markAllRead: markAllReadMutation.mutate,
    markAllReadAsync: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending,
    
    markMultipleRead,
    
    // Helpers
    useUnreadCount,
    
    // Check if there are unread notifications
    hasUnread: unreadCount > 0,
    
    // Get unread notifications
    unreadNotifications: notifications.filter(n => !n.isRead),
    
    // Get read notifications
    readNotifications: notifications.filter(n => n.isRead),
  };
}

// Hook for sending notifications (admin only)
export function useSendNotification() {
  const queryClient = useQueryClient();

  const sendNotificationMutation = useMutation({
    mutationFn: (data: any) => notificationsService.sendNotification(data),
    onSuccess: () => {
      toast.success("Notification sent successfully");
      queryClient.invalidateQueries({ queryKey: notificationKeys.my() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send notification");
    },
  });

  return {
    sendNotification: sendNotificationMutation.mutate,
    sendNotificationAsync: sendNotificationMutation.mutateAsync,
    isSending: sendNotificationMutation.isPending,
  };
}