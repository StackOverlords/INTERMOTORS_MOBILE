export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string; // ISO 8601
}

export interface NotificationsStore {
  items: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: AppNotification) => void;
  removeNotification: (id: string) => void;
}
