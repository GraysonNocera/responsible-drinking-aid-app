import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useRef } from 'react';

export default function Dev({ navigation }) {
  const [heartRate, onChangeHeartRate] = React.useState('');
  const [ethanol, onChangeEthanol] = React.useState('');
  const drinkCount = useRef(0);
  console.log("Dev Menu")

  return (
    <View>
      <Text>Dev Menu</Text>
      <Button title="Increment Drink" onPress={ () => {
        drinkCount.current = drinkCount.current + 1;
      }} />

      <TextInput placeholder="Heart Rate" onChangeText={onChangeHeartRate}/>
      <TextInput placeholder="BAC" onChangeText={onChangeEthanol}/>

      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}