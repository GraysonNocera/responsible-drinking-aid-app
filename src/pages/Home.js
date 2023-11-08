import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import bluetoothReceiver from '../services/bluetoothReceiver';
import React from 'react';
import { useRealm } from '@realm/react';
import { filter } from 'rxjs';
import { setNotification, cancelNotification } from '../services/notifications';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callEmergencyServices } from '../services/emergencyContact';
import { BluetoothMessages } from '../constants';
import * as Constants from '../constants';
import { calculateRiskFactor, calculateWidmark } from '../services/riskFactor';
import { virtualStream } from './Dev';
import { minutesToMillis } from '../services/notifications';

export default function Home({ navigation }) {
  const [ethanol, setEthanol] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [riskMessage, setRiskMessage] = useState('');
  const sensorOn = useRef(false); // ethanol sensor
  const riskFactor = useRef(0);
  const drinkNotificationId = useRef(null);
  const ethanolNotificationId = useRef(null);
  const ethanolCalculationTimeoutId = useRef(null);
  const realm = useRealm();
  const user = realm.objects('User');

  useEffect(() => {
    let bl = bluetoothReceiver.getInstance();
    let bluetoothMonitor = bl.initializeBluetooth();
    
    bluetoothMonitor.pipe(
      filter((value) => {
        return value.startsWith(BluetoothMessages.ethanol) && sensorOn.current;
      })
    ).subscribe(
      (value) => {
        const ethanol = value.split(':')[1].trim();
        setEthanol(ethanol);
        
        cancelNotification(ethanolNotificationId.current);
        ethanolNotificationId.current = setNotification(`Alert', 'It's been 30 minutes since your last ethanol reading. Please use the BAC sensor again.`, 60 * 30);

        clearTimeout(ethanolCalculationTimeoutId.current);
        ethanolCalculationTimeoutId.current = setTimeout(() => {
          const widmark = calculateWidmark(drinkCount, user[0].isMale, user[0].weight);
          setEthanol(widmark);
          riskFactor.current = calculateRiskFactor(widmark, drinkCount, user[0].height, user[0].weight, user[0].isMale);
        }, minutesToMillis(Constants.NOTIFICATION_AFTER_ETHANOL));
      }
    );
  
    bluetoothMonitor.pipe(
      filter((value) => {
        return value && value.startsWith(BluetoothMessages.heartRate);
      }
    )).subscribe(
      (value) => {
        const heartRate = value.split(':')[1].trim();
        setHeartRate(heartRate);
      }
    );
  
    bluetoothMonitor.pipe(
      filter((value) => {
        return [BluetoothMessages.addDrink, BluetoothMessages.subtractDrink, BluetoothMessages.clearDrinks].includes(value);
      })
    ).subscribe((value) => {
      if (value === BluetoothMessages.addDrink) {
        setDrinkCount((drinkCount) => drinkCount + 1);
        drinkNotificationId.current = setNotification('Drink', 'You recently consumed a drink! Please use the BAC sensor', Constants.SECONDS_TO_MINUTES * Constants.NOTIFICATION_AFTER_DRINK);
      } else if (value === BluetoothMessages.subtractDrink) {
        cancelNotification(drinkNotificationId.current);
        setDrinkCount((drinkCount) => (Math.max(drinkCount - 1, 0)));
      } else if (value === BluetoothMessages.clearDrinks) {
        cancelNotification(drinkNotificationId.current);
        setDrinkCount(0);
      }
    });
    
    bluetoothMonitor.pipe(
      filter((value) => {
        return value.startsWith(BluetoothMessages.ethanolSensorOn) || value.startsWith(BluetoothMessages.ethanolSensorOff);
      })
    ).subscribe((value) => {
      if (value === BluetoothMessages.ethanolSensorOn) {
        sensorOn.current = true;
      } else if (value === BluetoothMessages.ethanolSensorOff) {
        sensorOn.current = false;
      }
    });
  }, []);


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

  let riskContainerColor;
  if (riskMessage === 'Low risk') {
    riskContainerColor = 'green';
  } else if (riskMessage === 'Medium risk') {
    riskContainerColor = 'yellow';
  } else if (riskMessage === 'High risk') {
    riskContainerColor = 'red';
  }

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <View style={[styles.riskContainer, { backgroundColor: riskContainerColor }]}>
        <Text style={styles.riskText}>{riskMessage}</Text>
      </View>
      
      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <View style={styles.dataIconContainer}>
            <Icon name="flask" size={24} color="#2196F3" />
          </View>
          <View style={styles.dataTextContainer}>
            <Text style={styles.dataLabel}>Blood Alcohol Content (BAC):</Text>
            <Text style={styles.dataValue}>{ethanol}</Text>
          </View>
        </View>
        <View style={styles.dataItem}>
          <View style={styles.dataIconContainer}>
            <Icon name="heartbeat" size={24} color="#FF5733" />
          </View>
          <View style={styles.dataTextContainer}>
            <Text style={styles.dataLabel}>Heart Rate:</Text>
            <Text style={styles.dataValue}>{heartRate}</Text>
          </View>
        </View>
        <View style={styles.dataItem}>
          <View style={styles.dataIconContainer}>
            <Icon name="glass" size={24} color="#E67E22" />
          </View>
          <View style={styles.dataTextContainer}>
            <Text style={styles.dataLabel}>Drink Count:</Text>
            <Text style={styles.dataValue}>{drinkCount}</Text>
          </View>
        </View>
      </View>
        <Button title="Settings"
        onPress={() => {
          navigation.navigate('Settings')
        }} />

      {/* eslint-disable-next-line no-undef */}
      { __DEV__ &&
      <Button title="Dev"
        onPress={() => {
          navigation.navigate('Dev')
        }
      } />
      }
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings');
          }}
        >
          <Icon name="cog" size={40} color='#2196F3' />
        </TouchableOpacity>
      </View>
      <Button title="Emergency Contact Options"
        onPress={() => {
          navigation.navigate('Emergency')
        }} />
      <TouchableOpacity style={styles.emergencyButton} onPress={() => callEmergencyServices()}>
        <Text style={styles.emergencyButtonText}>Call Emergency Services</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    // fontWeight: 'bold',
  },
  settingsButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  emergencyButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emergencyButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  dataItem: {
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dataIconContainer: {
    marginRight: 10,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 16,
  },
});