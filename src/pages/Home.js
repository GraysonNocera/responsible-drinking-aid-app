import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useRealm } from '@realm/react';
import { useEffect, useState } from 'react';
import bluetoothReceiver from '../services/bluetoothReceiver';
import React from 'react';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/FontAwesome';



export default function Home({ navigation }) {
  const realm = useRealm();
  const [ethanol, setEthanol] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [riskMessage, setRiskMessage] = useState('');


  let bl = bluetoothReceiver.getInstance()
  bl.setHooks(setDrinkCount, setEthanol, setHeartRate)
  bl.initializeBluetooth();

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

    if (bac > 1 && bac <= 4) {
      newRiskMessage = 'Medium risk';
    } else if (bac > 4) {
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
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings');
            // realm.write(() => {
            //   realm.create('User', {
            //     height: 100,
            //     weight: 100,
            //     _id: Realm.BSON.ObjectId(),
            //   });
            // });
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
  dataContainer: {
    marginTop: 20,
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