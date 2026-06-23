import { create } from 'zustand';

type Notification = {
  id: string;
  message: string;
  details?: any;
  statusCode?: number;
};

type NotificationState = {
  notifications: Notification[];
  addNotification: (message: string, details?: string, statusCode?: number) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, details, statusCode) =>
    set(() => ({
      // Garde seulement la dernière erreur
      notifications: [
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, message, details, statusCode },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useNotificationStore;
