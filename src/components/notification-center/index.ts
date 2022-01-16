import { ref, Ref } from 'vue';

export enum NotificationType { warning, error, success, info }

type NotificationArg = {
  text: string;
  type?: NotificationType;
  visibilityTime?: number;
}

type Notification = NotificationArg & {
  id: number;
}

let idCounter = 0;
const notifications: Ref<Notification[]> = ref([]);

export const useNotificationCenter = (): {
  notifications: Ref<Notification[]>;
  addNotification: (notification: NotificationArg) => number;
  removeNotification: (id: number) => void;
} => {
  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(item => item.id !== id);
  };

  const addNotification = (notification: NotificationArg): number => {
    const id = idCounter++;
    notifications.value.push({
      type: NotificationType.info,
      ...notification,
      id,
    });

    setTimeout(() => {
      removeNotification(id);
    }, notification.visibilityTime ?? 4000);

    return id;
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
