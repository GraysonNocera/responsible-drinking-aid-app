import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useRef } from 'react';
import { Subject, merge, map, filter, interval, share } from 'rxjs';

export default function Dev({ navigation }) {
  const [heartRate, onChangeHeartRate] = React.useState('');
  const [ethanol, onChangeEthanol] = React.useState('');
  const drinkCount = useRef(0);
  console.log("Dev Menu")
  let drinkObservable = new Subject();
  let heartRateObservable = new Subject();
  let ethanolObservable = new Subject();
  
  return (
    <View>
      <Text>Dev Menu</Text>
      <Button title="Increment Drink" onPress={ () => {
        console.log("Increment Drink")
        drinkCount.current = drinkCount.current + 1;
        drinkObservable.next(true);
      }} />

      <TextInput placeholder="Heart Rate" onChangeText={onChangeHeartRate}/>
      <TextInput placeholder="BAC" onChangeText={onChangeEthanol}/>

      <Button title="Send Heart Rate" onPress={ () => {
          heartRateObservable.next(heartRate);
        }
      } />

      <Button title="Send BAC" onPress={ () => {
          ethanolObservable.next(ethanol);
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
  "Heart Rate",
]
const getRandomMessage = () => {
  const index = Math.floor(Math.random() * values.length);

  if (values[index] === "BAC") {
    const retVal = values[index].concat(':').concat((Math.random()).toString());
    console.log(retVal)
    return retVal;
  } else if (values[index] === "Heart Rate") {
    const retVal = values[index].concat(':').concat((Math.random() * 100).toString());
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
)