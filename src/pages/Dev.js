import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useRef } from 'react';
import bluetoothReceiver from '../services/bluetoothReceiver';
import { Subject, merge } from 'rxjs';

export default function Dev({ navigation }) {
  const [heartRate, onChangeHeartRate] = React.useState('');
  const [ethanol, onChangeEthanol] = React.useState('');
  const drinkCount = useRef(0);
  console.log("Dev Menu")
  let drinkObservable = new Subject();
  let heartRateObservable = new Subject();
  let ethanolObservable = new Subject();

  let bl = bluetoothReceiver.getInstance();
  let bluetoothMonitor = bl.initializeBluetooth(merge(drinkObservable, heartRateObservable, ethanolObservable));
  bluetoothMonitor.subscribe(
    (value) => {
      console.log('value', value);
    },
    (error) => {
      console.log('error', error);
    },
    () => {
      console.log('complete');
    }
  );

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