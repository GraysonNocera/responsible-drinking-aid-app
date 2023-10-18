import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import LocationService from '../services/location';
import { callEmergencyServices, callLovedOne, messageLovedOne } from '../services/emergencycontact';

export default function Emergency({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  // console.log(`Initial current   location: ` + currentLocation)
  
  useEffect(() => {
    LocationService.init();
  }, []);

  const updateCurrentLocation = () => {
    LocationService.getCurrentLocation(
      (location) => {
        console.log(location)
        setCurrentLocation(location);
        
      },
      (error) => {
        console.error(`Error getting location: ${error}`);
      }
    );
  };

  useEffect(() => {
    updateCurrentLocation();
  }, []);
  
  useEffect(() => {
    if (currentLocation) {
      fetchFormattedAddress(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation]);

  const contacts = [
    { name: 'Loved One 1', phoneNumber: '123-456-7890' },
  ];

  // console.log(`Updated current location: ` + currentLocation.latitude + ', ' + currentLocation.longitude)

  const fetchFormattedAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        // API Key hard coded in; TO-DO: fix
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBO5ohCGaH1sX2X1A_BuDYmwfu3AV92aG4`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setFormattedAddress(address);
      }
    } catch (error) {
      console.error(`Error fetching address: ${error}`);
    }
  };
  console.log(formattedAddress)
  return (
    <View style={styles.container}>
      <Text>Emergency Options</Text>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Call Emergency Services" onPress={() => callEmergencyServices()} />
      
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactContainer}>
          <Text>{contact.name}</Text>
          <Button
            title={`Call ${contact.name}`}
            onPress={() => callLovedOne(contact.phoneNumber)}
          />
          <Button
            title={`Message ${contact.name}`}
            onPress={() => messageLovedOne(contact.phoneNumber, formattedAddress)}
          />
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
