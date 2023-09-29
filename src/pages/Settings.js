import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState } from 'react';
import React from 'react';

export default function SettingsScreen({ navigation }) {
  const [weight, setWeight] = useState(-1);
  const [height, setHeight] = useState(-1);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <TextInput inputMode="text" placeholder="Height" />
      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
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
});