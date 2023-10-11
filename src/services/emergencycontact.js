import { Linking } from 'react-native';

// TO-DO: location services

export function callEmergencyServices() {
  const emergencyNumber = '911';

  Linking.openURL(`tel:${emergencyNumber}`)
    .catch((error) => console.error(`Error calling emergency services: ${error}`));
}

export function callLovedOne(phoneNumber) {
  Linking.openURL(`tel:${phoneNumber}`)
    .catch((error) => console.error(`Error calling loved one: ${error}`));
}

export function messageLovedOne(phoneNumber) {
  const currentAddress = '1 Poop St';
  
  const message = `I might be in an unsafe situation. My current address is: ${currentAddress}`;
  
  Linking.openURL(`sms:${phoneNumber}?body=${message}`)
    .catch((error) => console.error(`Error sending message to loved one: ${error}`));
}
