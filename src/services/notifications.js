import * as Notifications from "expo-notifications";
// import { useState, useRef, useEffect } from "react";
// import Device from "expo-constants";
// import { Platform } from "react-native";

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
export function setNotification(title, body, when=null) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: when,
  });
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