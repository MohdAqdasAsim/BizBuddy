// import * as Notifications from 'expo-notifications';

export interface LocalNotification {
  title: string;
  body: string;
  sound?: string;
  badge?: number;
  payload?: any;
}

export interface CustomNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export let notifications: CustomNotification[] = [];

// export async function addNotification(message: string, type: 'info' | 'warning' | 'error'): Promise<void> {
//   const newNotification: CustomNotification = {
//     id: generateId(),
//     message,
//     type,
//     timestamp: new Date(),
//     read: false,
//   };
//   notifications.push(newNotification);

//   // Request permissions if not already granted
//   const { status } = await Notifications.getPermissionsAsync();
//   if (status !== 'granted') {
//     await Notifications.requestPermissionsAsync();
//   }

//   // Show notification
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: type.charAt(0).toUpperCase() + type.slice(1),
//       body: message,
//       sound: 'default',
//       badge: 1,
//       data: {
//         type,
//         message,
//       },
//     },
//     trigger: null, // Show immediately
//   });
// }

export function removeNotification(id: string): void {
  notifications = notifications.filter(notification => notification.id !== id);
}

export function markAsRead(id: string): void {
  const notification = notifications.find(notification => notification.id === id);
  if (notification) {
    notification.read = true;
  }
}

export function markAllAsRead(): void {
  notifications.forEach(notification => notification.read = true);
}

export function getNotifications(): CustomNotification[] {
  return notifications;
}

export function getUnreadNotifications(): CustomNotification[] {
  return notifications.filter(notification => !notification.read);
}

function generateId(): string {
  return '_' + Math.random().toString(36).substr(2, 9);
}
