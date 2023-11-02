import * as Notifications from "expo-notifications";
import * as Constants from "../constants";

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

export const millisToSeconds = (millis) => {
  return millis / Constants.MILLIS_TO_SECONDS;
}

export const secondsToMinutes = (seconds) => {
  return seconds / Constants.SECONDS_TO_MINUTES;
}

export const millisToMinutes = (millis) => {
  return secondsToMinutes(millisToSeconds(millis));
}

export const minutesToMillis = (minutes) => {
  return minutes * Constants.SECONDS_TO_MINUTES * Constants.MILLIS_TO_SECONDS;
}