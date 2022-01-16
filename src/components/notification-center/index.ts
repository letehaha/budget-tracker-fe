import { ref, Ref } from 'vue';

export enum NotificationType { warning, error, success, info }

type NotificationID = number | string;
interface Notification {
  id?: NotificationID;
  text: string;
  type?: NotificationType;
  visibilityTime?: number;
}

let idCounter = 0;
const notifications: Ref<Notification[]> = ref([]);
const notificationIds: Record<NotificationID, unknown> = {};

export const useNotificationCenter = (): {
  notifications: Ref<Notification[]>;
  addNotification: (notification: Notification) => NotificationID;
  removeNotification: (id: NotificationID) => void;
} => {
  const removeNotification = (id: NotificationID) => {
    notifications.value = notifications.value.filter(item => item.id !== id);
  };

  const addNotification = (notification: Notification): NotificationID => {
    const id = notification.id ?? idCounter++;

    if (notificationIds[id]) {
      return undefined;
    }

    notificationIds[id] = id;

    notifications.value.push({
      type: NotificationType.info,
      ...notification,
      id,
    });

    setTimeout(() => {
      removeNotification(id);

      delete notificationIds[id];
    }, notification.visibilityTime ?? 4000);

    return id;
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
