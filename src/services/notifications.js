import * as Notifications from "expo-notifications";
// import { useState, useRef, useEffect } from "react";
// import Device from "expo-constants";
// import { Platform } from "react-native";
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // Do something with the notification data
});

console.log("Registering background task");
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

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

// export default function Notification() {
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) =>
//       setExpoPushToken(token)
//     );

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     null
//   );
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       sound: true,
//       lightColor: "#FF231F7C",
//       lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
//       bypassDnd: true,
//     });
//   }

//   return token;
// }