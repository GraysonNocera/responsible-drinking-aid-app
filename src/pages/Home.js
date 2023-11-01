import { StyleSheet, Text, View, Button } from 'react-native';
import { useRealm } from '@realm/react';
import { useEffect, useState } from 'react';
import bluetoothReceiver from '../services/bluetoothReceiver';
import React from 'react';
import Realm from 'realm';

export default function Home({ navigation }) {
  const realm = useRealm();
  const [ethanol, setEthanol] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [riskMessage, setRiskMessage] = useState('');
  const [notificationId, setNotificationId] = useState(null);

  let bl = bluetoothReceiver.getInstance();
  let res = bl.initializeBluetooth();
  res.subscribe(
    (value) => {
      console.log('value from Home: ', value);
    },
    (error) => {
      console.log('error', error);
    },
    () => {
      console.log('complete');
    }
  );

  useEffect(() => {
    // Good {morning/afternoon/evening!}
    const now = new Date();
    const currentHour = now.getHours();

    let newGreeting = 'Good morning!';
    if (currentHour >= 12 && currentHour < 18) {
      newGreeting = 'Good afternoon!';
    } else if (currentHour >= 18) {
      newGreeting = 'Good evening!';
    }

    setGreeting(newGreeting);

    const bac = ethanol; 
    let newRiskMessage = 'Low risk';

    if (bac > 10 && bac <= 20) {
      newRiskMessage = 'Medium risk';
    } else if (bac > 20) {
      newRiskMessage = 'High risk';
    }

    setRiskMessage(newRiskMessage);
  }, [ethanol]); 

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <View style={styles.riskContainer}>
        <Text style={styles.riskText}>{riskMessage}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>BAC: {ethanol}</Text>
        <Text style={styles.dataText}>Heart Rate: {heartRate}</Text>
        <Text style={styles.dataText}>Drink Count: {drinkCount}</Text>
      </View>
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
      { __DEV__ &&
      <Button title="Dev"
        onPress={() => {
          navigation.navigate('Dev')
        }
      } />
      }
      <Button title="Emergency"
        onPress={() => {
          navigation.navigate('Emergency')
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
  greetingContainer: {
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
    fontSize: 18,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 20,
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
  dataText: {
    fontSize: 18,
    marginBottom: 10,
  },
  riskContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  riskText: {
    fontSize: 18,
  },
});