import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import useBluetooth from '../services/useBluetooth';
import { vStream } from './Dev';
import * as Constants from '../constants';
import { callEmergencyServices, messageLovedOne } from '../services/emergencyContact';
import { useQuery } from '@realm/react';
import { addNotificationResponseReceivedListener } from '../services/notifications';
import useLocation from '../services/useLocation';

export default function Home({ navigation }) {
  const user = useQuery('User');
  
  const { 
    connectedDevice,
    ethanol,
    drinkCount,
    riskFactor,
    highRiskNotificationId,
    requestPermissions,
    scanForDevices,
    connectToDevice,
    handleMessage,
    disconnectFromDevice
  } = useBluetooth();

  const {
    updateCurrentLocation,
    fetchFormattedAddress,
    currentLocation,
    formattedAddress,
  } = useLocation();

  useEffect(() => {
    vStream.subscribe((value) => {
      console.log("Home: " + value)
      handleMessage(value);
    });
  }, []);

  useEffect(() => {
    addNotificationResponseReceivedListener(async (response) => {
      console.log(response);
      const id = response?.notification?.request?.identifier;
      console.log(id, highRiskNotificationId.current)

      if (id != highRiskNotificationId.current) { return; }
      console.log("High risk notification clicked");

      if (formattedAddress.current) {
        console.log("Sending message")
        messageLovedOne(user[0]?.emergencyContacts[0]?.phoneNumber, formattedAddress.current);
      } else {
        console.log("Updating current location in onPress")
        updateCurrentLocation(() => {
          fetchFormattedAddress().then((address) => {
            formattedAddress.current = address;
            messageLovedOne(user[0]?.emergencyContacts[0]?.phoneNumber, address);
          });
        });
      }
    });
  }, []);
  
  const handleConnectToBluetooth = async () => {
    console.log('Connecting to bluetooth')
    if (await requestPermissions()) {
      console.log('Permissions granted')
      await scanForDevices(async (device) => {
        if (!device) { return; }
        console.log('Connecting to device')
        await connectToDevice(device);
      });
    }
  }

  const handleDisconnectToBluetooth = async () => {
    console.log('Disconnecting from bluetooth')
    await disconnectFromDevice();
  }

  const getGreeting = () => {
    const now = new Date();
    const currentHour = now.getHours();

    let greeting = 'Good morning!';
    if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Good afternoon!';
    } else if (currentHour >= 18) {
      greeting = 'Good evening!';
    }

    return greeting;
  }

  const getRiskMessage = () => {
    console.log("Calculating message. Risk factor: " + riskFactor)
    let riskMessage = 'Low risk';
    if (riskFactor > Constants.MEDIUM_RISK && riskFactor <= Constants.HIGH_RISK) {
      riskMessage = 'Medium risk';
    } else if (riskFactor > Constants.HIGH_RISK) {
      riskMessage = 'High risk';
    }

    return riskMessage;
  }
  
  const getRiskContainerColor = () => {
    let riskContainerColor;
    if (riskMessage === 'Low risk') {
      riskContainerColor = 'green';
    } else if (riskMessage === 'Medium risk') {
      riskContainerColor = 'yellow';
    } else if (riskMessage === 'High risk') {
      riskContainerColor = 'red';
    }
    return riskContainerColor;
  }

  const getRiskTextColor = () => {
    let riskTextColor = 'white'
    if (riskMessage === 'Medium risk') {
      riskTextColor = 'black';
    }
    return riskTextColor;
  }

  const greeting = getGreeting();
  const riskMessage = getRiskMessage();
  const riskContainerColor = getRiskContainerColor();
  const riskTextColor = getRiskTextColor();

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Button title="Connect to Bluetooth" onPress={handleConnectToBluetooth} />
        <Button title="Disconnect to Bluetooth" onPress={handleDisconnectToBluetooth} />
        <Text>{connectedDevice ? "Connected!" : "Disconnected!"}</Text>
      </View>
      <View style={[styles.riskContainer, { backgroundColor: riskContainerColor }]}>
        <Text style={[styles.riskText, {color: riskTextColor }]}>{riskMessage}</Text>
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
            <Icon name="car" size={24} color="#2196F3" />
          </View>
          <View style={styles.dataTextContainer}>
            <Text style={styles.dataLabel}>Time until sobriety (hours):</Text>
            <Text style={styles.dataValue}>{ Math.max((ethanol - 0.08) / 0.015, 0) }</Text>
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
        {riskMessage === 'High risk' && (
          <TouchableOpacity
            style={styles.highRiskButton} // Define styles for the button
            onPress={() => 
              {
                if (formattedAddress.current) {
                  console.log("Sending message")
                  messageLovedOne(user[0]?.emergencyContacts[0]?.phoneNumber, formattedAddress.current);
                } else {
                  console.log("Updating current location in onPress")
                  updateCurrentLocation(() => {
                    fetchFormattedAddress().then((address) => {
                      formattedAddress.current = address;
                      messageLovedOne(user[0]?.emergencyContacts[0]?.phoneNumber, address);
                    });
                  });
                }
              }}
          >
            <Text style={styles.highRiskButtonText}>Text my emergency contact</Text>
          </TouchableOpacity>
        )}
      </View>

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
      <View style={styles.contactButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Emergency');
          }}
        >
          <Icon name="phone" size={40} color='#2196F3' />
        </TouchableOpacity>
      </View>
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
  contactButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20
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
  highRiskButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  highRiskButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});