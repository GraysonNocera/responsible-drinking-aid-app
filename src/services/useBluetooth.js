import { useMemo, useRef, useState } from "react";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import * as Location from "expo-location";
import { Buffer } from 'buffer';
import { setNotification, cancelNotification, minutesToMillis } from "./notifications";
import { calculateRiskFactor, calculateWidmark } from "./riskFactor";
import { useRealm } from "@realm/react";
import * as Constants from "../constants";
import { BluetoothMessages } from "../constants";

const SERVICE_UUID = 'FFE0'; // service UUID for HM19
const CHARACTERISTIC_UUID = 'FFE1'; // characteristic UUID for HM19
const DEVICE_NAME = 'RDA477'; // name of the device we are connecting to

export default function useBluetooth() {
  const manager = useMemo(() => new BleManager(), []);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);
  const [ethanol, setEthanol] = useState(0);
  const ethanolReadings = useRef([]);
  const ethanolSensorOn = useRef(false);
  const [drinkCount, setDrinkCount] = useState(0);
  const drinkCountTimestamps = useRef([]);
  const sensorOn = useRef(false); // ethanol sensor
  const riskFactor = useRef(0);
  const drinkNotificationId = useRef(null);
  const ethanolNotificationId = useRef(null);
  const ethanolCalculationTimeoutId = useRef(null);
  const realm = useRealm();
  const user = realm.objects('User');

  const requestPermissions = async () => {
    const permissions = await Location.requestForegroundPermissionsAsync();
    console.log(permissions)
    return permissions.granted;
  }

  const scanForDevices = async (callback=null) => {

    manager.startDeviceScan([SERVICE_UUID, CHARACTERISTIC_UUID], null, (error, device) => {
      if (error) {
        console.log('Error scanning for devices:', error);
        return;
      }

      console.log('Found device:', device.name);

      if (device.name == DEVICE_NAME) {
        console.log('Found our device!');
        console.log("Length of devices: " + devices.length)
        setDevices([...devices, device]);
        if (callback) {
          callback(device);
        }
      }
    });
  }

  const connectToDevice = async (device) => {
    try {
      await device.connect();
      console.log('Connected to device!');
      await device.discoverAllServicesAndCharacteristics();
      console.log('Discovered all services and characteristics!');
      manager.stopDeviceScan();
      setConnectedDevice(device);
      device.monitorCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID, (error, characteristic) => {
        if (error) {
          if (error.errorCode == BleErrorCode.DeviceDisconnected) {
            console.log('Device disconnected');
            setConnectedDevice(null);
          } else {
            console.log('Error monitoring characteristic:', error)
          }

          return;
        } 
        
        handleMessage(Buffer.from(characteristic.value, 'base64').toString('ascii').trim())
      });
    } catch (e) {
      console.log('Error connecting to device', e);
    }
  }

  const handleMessage = (message) => {
    console.log("Received message: " + message)
    if (!message || message.length == 0 || typeof message != 'string') {
      return;
    }

    if (message.startsWith(BluetoothMessages.ethanol) && ethanolSensorOn.current) {
      handleEthanolMessage(message);
    } else if (message.startsWith(BluetoothMessages.heartRate)) {
      handleHeartRateMessage(message);
    } else if (message.startsWith(BluetoothMessages.addDrink)) {
      handleAddDrinkMessage();
    } else if (message.startsWith(BluetoothMessages.subtractDrink)) {
      handleSubtractDrinkMessage();
    } else if (message.startsWith(BluetoothMessages.clearDrinks)) {
      handleClearDrinksMessage();
    } else if (message === BluetoothMessages.ethanolSensorOn || message === BluetoothMessages.ethanolSensorOff) {
      handleEthanolSensorMessage(message);
    }
  }

  const handleEthanolSensorMessage = (message) => {
    if (message === BluetoothMessages.ethanolSensorOff) {
      sensorOn.current = false;
      if (ethanolReadings.current.length > 0) {
        setEthanol(Math.max(ethanolReadings.current))
      }
      
      ethanolNotificationId.current = setNotification("Breathalyzer is off!", "To record a reading, hold top button for 5 seconds and wait 10 seconds before blowing into it.");
    } else {
      sensorOn.current = true;
      ethanolNotificationId.current = setNotification("Breathalyzer is on!", "Please blow into the breathalyzer to record your BAC level.");
    }

    ethanolReadings.current = []
  }

  const handleAddDrinkMessage = () => {
    setDrinkCount((drinkCount) => drinkCount + 1);
    drinkCountTimestamps.current.append(new Date());
    drinkNotificationId.current = setNotification('Drink', 'You recently consumed a drink! Please use the BAC sensor', Constants.SECONDS_TO_MINUTES * Constants.NOTIFICATION_AFTER_DRINK);
  }

  const handleSubtractDrinkMessage = async () => {
    drinkCountTimestamps.current.pop();
    await cancelNotification(drinkNotificationId.current);
    setDrinkCount((drinkCount) => (Math.max(drinkCount - 1, 0)));
  }

  const handleClearDrinksMessage = async () => {
    drinkCountTimestamps.current = [];
    await cancelNotification(drinkNotificationId.current);
    setDrinkCount(0);
  }

  const handleEthanolMessage = async (message) => {
    const ethanol = message.split(':')[1].trim();
    ethanolReadings.current.push(parseInt(ethanol));

    await cancelNotification(ethanolNotificationId.current);
    ethanolNotificationId.current = await setNotification(`Alert', 'It's been 30 minutes since your last ethanol reading. Please use the BAC sensor again.`, Constants.SECONDS_TO_MINUTES * Constants.NOTIFICATION_AFTER_ETHANOL);

    clearTimeout(ethanolCalculationTimeoutId.current);
    ethanolCalculationTimeoutId.current = setTimeout(() => {
      const widmark = calculateWidmark(drinkCount, user[0].isMale, user[0].weight);
      setEthanol(widmark);
      riskFactor.current = calculateRiskFactor(widmark, drinkCountTimestamps.current, user[0].height, user[0].weight, user[0].isMale);
    }, minutesToMillis(Constants.NOTIFICATION_AFTER_ETHANOL));
  };

  const handleHeartRateMessage = (message) => {
    const heartRate = message.split(':')[1].trim();
    setHeartRate(heartRate);
  }

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  }

  return {
    devices,
    connectedDevice,
    heartRate,
    ethanol,
    drinkCount,
    requestPermissions,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
  };
}