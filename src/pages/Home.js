import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callEmergencyServices } from '../services/emergencyContact';
import useBluetooth from '../services/useBluetooth';

export default function Home({ navigation }) {
  const [greeting, setGreeting] = useState('');
  const [riskMessage, setRiskMessage] = useState('');
  const { 
    devices,
    connectedDevice,
    heartRate,
    ethanol,
    drinkCount,
    requestPermissions,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice
  } = useBluetooth();

  const handleConnectToBluetooth = async () => {
    console.log('Connecting to bluetooth')
    if (await requestPermissions()) {
      console.log('Permissions granted')
      await scanForDevices();
    }

    if (devices.length > 0) {
      console.log('Connecting to device')
      await connectToDevice(devices[0]);
    }
  }

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
        <Button title="Connect to Bluetooth" onPress={handleConnectToBluetooth} />
        <Text>{connectedDevice ? "Connected!" : "Disconnected!"}</Text>
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