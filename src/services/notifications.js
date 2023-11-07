import * as Notifications from "expo-notifications";

// Setup notifications
export function setupNotifications(shouldShowAlert=true, shouldPlaySound=true, shouldSetBadge=true) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: shouldShowAlert,
      shouldPlaySound: shouldPlaySound,
      shouldSetBadge: shouldSetBadge,
    }),
  });
}

// Send notification
export function setNotification(title, body, when=0) {
  // time is in seconds

  const id = Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: { seconds: when },
  });

  return id
}