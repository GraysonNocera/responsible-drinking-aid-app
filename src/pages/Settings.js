import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { useState } from 'react';
import React from 'react';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRealm } from '@realm/react';

export default function SettingsScreen({ navigation }) {
  const [weight, onWeightChange] = useState(-1);
  const [height, onHeightChange] = useState(-1);
  const realm = useRealm();

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>User Information</Text>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput inputMode="text" placeholder="Height" onChangeText={onHeightChange} />
        <TextInput inputMode="text" placeholder="Weight" onChangeText={onWeightChange} />
        <Button title="Save Height and Weight" onPress={() => {
          console.log('Save Height and Weight');
          let heightInt = parseInt(height);
          let weightInt = parseInt(weight);
          if (heightInt < 0 || weightInt < 0) {
            console.log('Invalid height or weight');
            return;
          }
          if (isNaN(heightInt) || isNaN(weightInt)) {
            console.log('Invalid height or weight');
            return;
          }

          realm.write(() => {
            realm.create('User', {
              height: heightInt,
              weight: weightInt,
              _id: Realm.BSON.ObjectId(),
            });
          });
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