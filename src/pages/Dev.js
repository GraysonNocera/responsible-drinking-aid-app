import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useRef } from 'react';
import { Subject, map, filter, interval, share } from 'rxjs';
import { BluetoothMessages } from '../constants';

export const vStream = new Subject();

export default function Dev({ navigation }) {
  const [ethanol, onChangeEthanol] = React.useState('');
  const drinkCount = useRef(0);
  console.log("Dev Menu")
  
  return (
    <View>
      <Text>Dev Menu</Text>
      <Button title="Increment Drink" onPress={ () => {
        console.log("Increment Drink")
        drinkCount.current = drinkCount.current + 1;
        vStream.next(BluetoothMessages.addDrink);
      }} />

      <Button title="Decrement Drink" onPress={ () => {
        console.log("Decrement Drink")
        drinkCount.current = drinkCount.current - 1;
        vStream.next(BluetoothMessages.subtractDrink);
      }} />

      <Button title="Clear Drink" onPress={ () => {
        console.log("Clear Drink")
        drinkCount.current = 0;
        vStream.next(BluetoothMessages.clearDrinks);
      }} />


      <TextInput placeholder="BAC" onChangeText={onChangeEthanol}/>

      <Button title="Send BAC" onPress={ () => {
          vStream.next(BluetoothMessages.ethanol.concat(":").concat(ethanol));
        }
      } />

      <Button title="Turn on Ethanol sensor" onPress={ () => {
          vStream.next(BluetoothMessages.ethanolSensorOn);
        }
      } />

      <Button title="Turn off Ethanol sensor" onPress={ () => {
          vStream.next(BluetoothMessages.ethanolSensorOff);
        }
      } />

      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const values = [
  "Add Drink",
  "Subtract Drink",
  "Ethanol Sensor On",
  "BAC",
]
const getRandomMessage = () => {
  const index = Math.floor(Math.random() * values.length);

  if (values[index] === "BAC") {
    const retVal = values[index].concat(':').concat((Math.random()).toString());
    console.log(retVal)
    return retVal;
  }
  console.log(values[index])
  return values[index];
}

console.log("Dev Menu".startsWith("Dev"))

export const virtualStream = interval(1000 * 2).pipe(
  map(() => getRandomMessage()),
  filter((value) => {
    return typeof value === 'string';
  }),
  share(),
);