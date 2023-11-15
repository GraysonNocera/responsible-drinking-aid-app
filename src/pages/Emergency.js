import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LocationService from '../services/location';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callEmergencyServices, callLovedOne, messageLovedOne } from '../services/emergencyContact';
import { useRealm } from '@realm/react';

export default function Emergency({ navigation }) {
  const currentLocation = useRef(null);
  const formattedAddress = useRef('');
  const realm = useRealm();

  const user = realm.objects('User');
  const emergencyContacts = user[0]?.emergencyContacts;

  useEffect(() => {
    LocationService.init();
    updateCurrentLocation();
  }, []);

  const updateCurrentLocation = () => {
    LocationService.getCurrentLocation(
      (location) => {
        console.log(location)
        currentLocation.current = location;
        console.log(`Current location: ${currentLocation.current.latitude}, ${currentLocation.current.longitude}`)
      },
      (error) => {
        console.error(`Error getting location: ${error}`);
      }
    );
  };

  const fetchFormattedAddress = async (latitude, longitude, callback=null) => {
    try {
      console.log(`Fetching address for ${latitude}, ${longitude}`)
      const response = await fetch(
        // API Key hard coded in; TO-DO: fix
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=GOOGLEAPIKEYHERE`
      );
      const data = await response.json();
      console.log(data)
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        console.log(`Formatted address: ${address}`)
        formattedAddress.current = address;
        if (callback) {
          callback(address);
        }
      }
    } catch (error) {
      console.error(`Error fetching address: ${error}`);
    }
  };
  
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
              onPress={async () => {
                updateCurrentLocation();
                await fetchFormattedAddress(currentLocation.current?.latitude, currentLocation.current?.longitude, (address) => {
                  messageLovedOne(contact.phoneNumber, address);
                });
              }}
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
