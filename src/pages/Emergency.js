import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { callEmergencyServices, callLovedOne, messageLovedOne } from '../services/emergencycontact';

// TO-DO: pretty up this page, don't hardcode contacts

export default function Emergency({ navigation }) {
  const contacts = [
    { name: 'Loved One 1', phoneNumber: '123-456-7890' },
    // { name: 'Loved One 2', phoneNumber: '987-654-3210' },
  ];

  return (
    <View style={styles.container}>
      <Text>Emergency Options</Text>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Call Emergency Services" onPress={callEmergencyServices} />
      
      {/* TO-DO: realm for loved ones contacts */}
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactContainer}>
          <Text>{contact.name}</Text>
          <Button title={`Call ${contact.name}`} onPress={() => callLovedOne(contact.phoneNumber)} />
          <Button title={`Message ${contact.name}`} onPress={() => messageLovedOne(contact.phoneNumber)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactContainer: {
    marginTop: 20,
  },
});
