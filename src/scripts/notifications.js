/**
 * Pushes a new notification to an array in local storage.
 * Each notification will have a type and a message.
 *
 * @param {string} type - The type of the notification (e.g., 'error', 'success')
 * @param {string} message - The message for the notification
 */
export const pushLocalNotification = (type, message) => {
  const existingNotifications = JSON.parse(localStorage.getItem('notifications')) || [];

  const newNotification = {
    id: existingNotifications.length,
    type,
    message,
    time: Date.now(),
  };

  const updatedNotifications = [...existingNotifications, newNotification];

  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  return newNotification;
};
