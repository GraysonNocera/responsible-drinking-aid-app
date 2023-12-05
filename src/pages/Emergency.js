import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callEmergencyServices, callLovedOne, messageLovedOne } from '../services/emergencyContact';
import { useQuery } from '@realm/react';
import LocationContext from '../services/LocationContext';

export default function Emergency({ navigation }) {
  const user = useQuery('User');
  const emergencyContacts = user[0]?.emergencyContacts;
  const { updateCurrentLocation, fetchFormattedAddress } = useContext(LocationContext);

  const handleMessageLovedOne = (phoneNumber) => {
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
    <View style={styles.container}>
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyText}>Emergency Options</Text>
      </View>
      <View style={styles.homeButtonContainer}>
        <TouchableOpacity
        onPress={() => navigation.navigate('Home')} 
        >
          <Icon name="home" size={40} color='#2196F3' />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.emergencyButton} onPress={() => callEmergencyServices()}>
        <Text style={styles.emergencyButtonText}>Call Emergency Services</Text>
      </TouchableOpacity>

      {emergencyContacts?.map((contact, index) => (
        <View key={index} style={styles.contactContainer}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactNumber}>{contact.phoneNumber}</Text>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => callLovedOne(contact.phoneNumber)}
            >
              <Icon name="phone" size={24} color="#2196F3" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleMessageLovedOne(contact.phoneNumber)}
            >
              <Icon name="envelope" size={24} color="#2196F3" />
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          </View>
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
  contactInfo: {
    flex: 2,
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
  contactButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 4,
    color: '#2196F3',
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  emergencyContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
  },
  emergencyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, 
    marginBottom: 20,
  },
  emergencyButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
