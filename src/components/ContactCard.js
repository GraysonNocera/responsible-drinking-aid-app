import React, {useContext} from "react";
import { Text, View } from 'react-native';
import { callLovedOne, messageLovedOne } from '../services/emergencyContact';
import LocationContext from '../services/LocationContext';
import ContactCardIcon from "./ContactCardIcon";

export default function ContactCard({ contact, index }) {
  const { updateCurrentLocation, fetchFormattedAddress } = useContext(LocationContext);

  const handleMessageLovedOne = (phoneNumber) => {
    console.log("Message loved one button pressed")
    updateCurrentLocation((location, error) => {
      if (error) {
        console.error(`Error getting location: ${error}`);
        return
      }
      fetchFormattedAddress(location.latitude, location.longitude).then((address) => {
        messageLovedOne(phoneNumber, address);
      });
    });
  }

  return (
    <View key={index} style={styles.contactContainer}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactNumber}>{contact.phoneNumber}</Text>
      </View>
      <View style={styles.contactActions}>
        <ContactCardIcon iconName="phone" contact={contact} handler={callLovedOne} buttonText="Call" />
        <ContactCardIcon iconName="envelope" contact={contact} handler={handleMessageLovedOne} buttonText="Message" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    maxWidth: 300,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactNumber: {
    color: '#555',
  },
  contactActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 2,
  }
});