import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import bluetoothReceiver from '../services/bluetoothReceiver';
import { BluetoothMessages } from '../services/bluetoothReceiver';

export default function Dev({ navigation }) {
  const [heartRate, onChangeHeartRate] = React.useState('');
  const [ethanol, onChangeEthanol] = React.useState('');
  let bl = bluetoothReceiver.getInstance();
  console.log("Dev Menu")

  return (
    <View>
      <Text>Dev Menu</Text>
      <Button title="Increment Drink" onPress={ () => {
        bl.receiveData(null, bl.convertToCharacteristic(BluetoothMessages.drink))
      }} />

      <TextInput placeholder="Heart Rate" onChangeText={onChangeHeartRate}/>
      <Button title="Send Heart Rate" onPress={ () => {
        bl.receiveData(null, bl.convertToCharacteristic(BluetoothMessages.heart + ": " + heartRate))
      }} />

      <TextInput placeholder="BAC" onChangeText={onChangeEthanol}/>
      <Button title="Send BAC" onPress={ () => {
        bl.receiveData(null, bl.convertToCharacteristic(BluetoothMessages.ethanol + ": " + ethanol))
      }} />
      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}