import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ContactCardIcon({iconName, contact, handler, buttonText}) {

  return (
    <TouchableOpacity
      style={styles.contactButton}
      onPress={() => handler(contact.phoneNumber)}
    >
      <Icon name={iconName} size={24} color="#2196F3" />
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contactButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 4,
    color: '#2196F3',
  }
});