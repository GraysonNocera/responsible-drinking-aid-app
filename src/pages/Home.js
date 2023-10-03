import { StyleSheet, Text, View, Button } from 'react-native';
import { useRealm } from '@realm/react';
import { useState } from 'react';
import bluetoothReceiver from '../services/BluetoothReceiver';
import React from 'react';
import Realm from 'realm';

export default function Home({ navigation }) {
  const realm = useRealm();
  const [ethanol, setEthanol] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);

  let bl = bluetoothReceiver.getInstance()
  bl.setHooks(setDrinkCount, setEthanol, setHeartRate)
  bl.initializeBluetooth();

  return (
    <View style={styles.container}>
      <Text>BAC: {ethanol}</Text>
      <Text>Heartrate: {heartRate}</Text>
      <Text>Drink Count: {drinkCount}</Text>
      <Button title="Settings"
        onPress={() => {
          navigation.navigate('Settings')
          realm.write(() => {
            realm.create('User', {
              height: 100,
              weight: 100,
              _id: Realm.BSON.ObjectId(),
            });
          });
        }} />
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
});
