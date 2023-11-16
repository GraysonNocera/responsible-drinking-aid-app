import { Linking } from 'react-native';

export function callEmergencyServices() {
  const emergencyNumber = '911';

  Linking.openURL(`tel:${emergencyNumber}`)
    .catch((error) => console.error(`Error calling emergency services: ${error}`));
}

export function callLovedOne(phoneNumber) {
  Linking.openURL(`tel:${phoneNumber}`)
    .catch((error) => console.error(`Error calling loved one: ${error}`));
}

export function messageLovedOne(phoneNumber, currentLocation) {
  if (!phoneNumber) {
    console.error("No phone number provided");
    return;
  }

  if (!currentLocation) {
    console.error("No current location provided");
    return;
  }
  
  const message = `I might be in an unsafe situation. My current address is: ${currentLocation}`;
  
  Linking.openURL(`sms:${phoneNumber}?body=${message}`)
    .catch((error) => console.error(`Error sending message to loved one: ${error}`));
}
