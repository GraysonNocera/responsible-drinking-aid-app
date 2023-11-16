import { Linking } from 'react-native';
import SendSMS from 'react-native-sms';

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
  const message = `I might be in an unsafe situation. My current address is: ${currentLocation}`;
  console.log(phoneNumber, currentLocation)
  SendSMS.send(
    {
      body: message,
      recipients: [phoneNumber],
      successTypes: ['sent', 'queued'],
      // allowAndroidSendWithoutReadPermission: true,
    },
    (completed, cancelled, error) => {
      if (completed) {
        console.log('SMS Sent Completed');
      } else if (cancelled) {
        console.log('SMS Sent Cancelled');
      } else if (error) {
        console.log('Some error occured');
      }
    },
  );
  console.log('stepped')
}
    