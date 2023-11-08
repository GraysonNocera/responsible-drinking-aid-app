import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { useState } from 'react';
import React from 'react';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, useRealm } from '@realm/react';

export default function SettingsScreen({ navigation }) {
  const [weight, onWeightChange] = useState(-1);
  const [height, onHeightChange] = useState(-1);
  const [gender, onGenderChange] = useState('');

  const [emergencyContact1Name, onEmergencyContact1NameChange] = useState('');
  const [emergencyContact1Phone, onEmergencyContact1PhoneChange] = useState('');
  const [emergencyContact2Name, onEmergencyContact2NameChange] = useState('');
  const [emergencyContact2Phone, onEmergencyContact2PhoneChange] = useState('');
  const [emergencyContact3Name, onEmergencyContact3NameChange] = useState('');
  const [emergencyContact3Phone, onEmergencyContact3PhoneChange] = useState('');
  const [emergencyContact4Name, onEmergencyContact4NameChange] = useState('');
  const [emergencyContact4Phone, onEmergencyContact4PhoneChange] = useState('');
  const [emergencyContact5Name, onEmergencyContact5NameChange] = useState('');
  const [emergencyContact5Phone, onEmergencyContact5PhoneChange] = useState('');

  const realm = useRealm();
  const user = useQuery('User');

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>User Information</Text>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput inputMode="text" placeholder="Height" onChangeText={onHeightChange} />
        <TextInput inputMode="text" placeholder="Weight" onChangeText={onWeightChange} />
        <TextInput inputMode="text" placeholder="Gender" onChangeText={onGenderChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 1 Name" onChangeText={onEmergencyContact1NameChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 1 Phone" onChangeText={onEmergencyContact1PhoneChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 2 Name" onChangeText={onEmergencyContact2NameChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 2 Phone" onChangeText={onEmergencyContact2PhoneChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 3 Name" onChangeText={onEmergencyContact3NameChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 3 Phone" onChangeText={onEmergencyContact3PhoneChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 4 Name" onChangeText={onEmergencyContact4NameChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 4 Phone" onChangeText={onEmergencyContact4PhoneChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 5 Name" onChangeText={onEmergencyContact5NameChange} />
        <TextInput inputMode="text" placeholder="Emergency Contact 5 Phone" onChangeText={onEmergencyContact5PhoneChange} />
        
        <Button title="Save Height, Weight, and Gender" onPress={() => {
          console.log('Save Height and Weight');
          let heightInt = parseInt(height);
          let weightInt = parseInt(weight);
          let isMale = gender === "Male" ? true : false;

          let ec1n = emergencyContact1Name
          let ec1p = emergencyContact1Phone
          let ec2n = emergencyContact1Name
          let ec2p = emergencyContact1Phone
          let ec3n = emergencyContact1Name
          let ec3p = emergencyContact1Phone
          let ec4n = emergencyContact1Name
          let ec4p = emergencyContact1Phone
          let ec5n = emergencyContact1Name
          let ec5p = emergencyContact1Phone

          const ecNames = [ec1n, ec2n, ec3n, ec4n, ec5n]; // Define your existing variables
          const ecPhones = [ec1p, ec2p, ec3p, ec4p, ec5p]; // Define phone numbers
          
          // const ecNames = ['ec1n', 'ec2n', 'ec3n', 'ec4n', 'ec5n']; // Define your existing variables
          // const ecPhones = ['ec1p', 'ec2p', 'ec3p', 'ec4p', 'ec5p']; // Define phone numbers

          const numContacts = Math.min(ecNames.length, 5);

          if (heightInt < 0 || weightInt < 0) {
            console.log('Invalid height or weight');
            return;
          }
          if (isNaN(heightInt) || isNaN(weightInt)) {
            console.log('Invalid height or weight');
            return;
          }

          if (user.length == 1) {
            console.log("Updating user")
            realm.write(() => {
              user[0].height = heightInt;
              user[0].weight = weightInt;
              user[0].isMale = isMale;
            });
            for (let i = 0; i < 1; i++) {
              if (ecNames[i] !== null) {
                realm.write(() => {
                  user[0].emergencyContacts[i].name = ecNames[i];
                  user[0].emergencyContacts[i].phoneNumber = ecPhones[i];
                });
              } else {
                // Handle the case where ecNames[i] is null or unchanged
                console.log(`ecNames[${i}] is null or unchanged.`);
              }
            }
          } else {
            console.log("Creating user")
            realm.write(() => {
              const user = realm.create('User', {
                height: heightInt,
                weight: weightInt,
                isMale: isMale,
                _id: Realm.BSON.ObjectId(),
              });

              for (let i = 0; i < numContacts; i++) {
                if (ecNames[i] !== null) {
                  user.emergencyContacts.push({
                    name: ecNames[i],
                    phoneNumber: ecPhones[i],
                  });
                } else {
                  // Handle the case where ecNames[i] is null or unchanged
                  console.log(`ecNames[${i}] is null or unchanged.`);
                }
              }
            });
          }
        }
        } />
      </View>
      <View style={styles.homeButtonContainer}>
        <TouchableOpacity
        onPress={() => navigation.navigate('Home')} 
        >
          <Icon name="home" size={40} color='#2196F3' />
        </TouchableOpacity>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    alignItems: 'flex-start',
    paddingRight: 20,
  },
  userInfoText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  userInfoContainer: {
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
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});