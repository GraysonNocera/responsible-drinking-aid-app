import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import {bluetoothReceiver} from '../services/bluetoothReceiver';
import { BluetoothMessages } from '../services/bluetoothReceiver';

export default function Dev({ navigation }) {
  const [heartRate, onChangeHeartRate] = React.useState('');
  const [ethanol, onChangeEthanol] = React.useState('');
  let bl = bluetoothReceiver.getInstance();

  return <View>
    <Text>Dev Menu</Text>
    <Button onPress={
      bl.receiveData(null, BluetoothMessages.drink)
    }>Increment Drink</Button>

    <TextInput placeholder="Heart Rate" onChangeText={onChangeHeartRate}/>
    <Button onPress={
      bl.receiveData(null, BluetoothMessages.heart + ": " + heartRate)
    }>
      Send Heart Rate
    </Button>

    <TextInput placeholder="BAC" onChangeText={onChangeEthanol}/>
    <Button onPress={
      bl.receiveData(null, BluetoothMessages.ethanol + ": " + ethanol)
    }>
      Send BAC
    </Button>
    <Button onPress={
      navigation.navigate('Home')
    }>
      Home
    </Button>
    </View>
}