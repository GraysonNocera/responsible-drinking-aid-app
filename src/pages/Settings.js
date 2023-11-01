import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function SettingsScreen({ navigation }) {
  const [weight, setWeight] = useState(-1);
  const [height, setHeight] = useState(-1);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>User Information</Text>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput inputMode="text" placeholder="Height" />
        <TextInput inputMode="text" placeholder="Weight" />
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