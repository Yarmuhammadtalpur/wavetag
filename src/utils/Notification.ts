import { getSocket } from '../config/socket';
import { NotificationObjectType } from '../types/notification.types';

/**
 * Send a notification to a single user.
 *
 * @param {NotificationObjectType} notificationObject This is includes the Notification Details to send to the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the notification was sent successfully
 */
export const sendNotification = async (
  notificationObject: NotificationObjectType
) => {
  const socket = getSocket();
  socket.emit(notificationObject.to, notificationObject)
};
