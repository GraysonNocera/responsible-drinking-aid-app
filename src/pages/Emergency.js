import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callEmergencyServices } from '../services/emergencyContact';
import { useQuery } from '@realm/react';
import ContactCard from '../components/ContactCard';

export default function Emergency({ navigation }) {
  const user = useQuery('User');
  const emergencyContacts = user[0]?.emergencyContacts;
  
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
        <ContactCard contact={contact} key={index} />
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
