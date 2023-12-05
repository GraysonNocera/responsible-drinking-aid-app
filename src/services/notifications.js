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

  Notifications.addNotificationResponseReceivedListener(response => {
    const id = response?.notification?.request?.identifier;
    if (id == Constants.HIGH_RISK_NOTIFICATION_ID) {
      console.log("High risk notification clicked");
    }
  });
}

export function addNotificationResponseReceivedListener(callback) {
  Notifications.addNotificationResponseReceivedListener(callback);
}

// Send notification
export async function setNotification(title, body, when=0, repeat=false) {
  // time is in seconds

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: 
    { 
      seconds: when,
      repeats: repeat
    },
  });

  return Promise.resolve(id);
}

export async function cancelNotification(id) {
  if (id != null) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
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