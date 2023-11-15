import { useMemo, useRef, useState } from "react";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import * as Location from "expo-location";
import { Buffer } from 'buffer';
import { setNotification, cancelNotification, minutesToMillis } from "./notifications";
import { calculateAndHandleRiskFactor, calculateRiskFactor, calculateWidmark } from "./riskFactor";
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
  const [ethanol, setEthanol] = useState(0);
  const ethanolReadings = useRef([]);
  const [drinkCount, setDrinkCount] = useState(0);
  const drinkCountTimestamps = useRef([]);
  const sensorOn = useRef(false); // ethanol sensor
  const [riskFactor, setRiskFactor] = useState(0); //update to use state
  const ethanolNotificationId = useRef(null);
  const ethanolCalculationTimeoutId = useRef(null);
  const highRiskNotificationId = useRef(null);
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
    console.log("Received message: " + message + ".")
    if (!message || message.length == 0 || typeof message != 'string') {
      return;
    }

    if (message.startsWith(BluetoothMessages.ethanol) && sensorOn.current) {
      console.log("Received ethanol message")
      handleEthanolMessage(message);
    } else if (message.startsWith(BluetoothMessages.addDrink)) {
      console.log("Received add drink message")
      handleAddDrinkMessage();
    } else if (message.startsWith(BluetoothMessages.subtractDrink)) {
      console.log("Received subtract drink message")
      handleSubtractDrinkMessage();
    } else if (message.startsWith(BluetoothMessages.clearDrinks)) {
      console.log("Received clear drinks message")
      handleClearDrinksMessage();
    } else if (message === BluetoothMessages.ethanolSensorOn || message === BluetoothMessages.ethanolSensorOff) {
      console.log("Received ethanol sensor on/off message")
      handleEthanolSensorMessage(message);
    } else {
      console.log("Received unknown message")
    }
  }

  const handleEthanolSensorMessage = async (message) => {
    if (message === BluetoothMessages.ethanolSensorOff) {
      sensorOn.current = false;
      if (ethanolReadings.current.length > 0) {
        console.log("Ethanol readings: " + ethanolReadings.current)
        const eth = Math.max(...ethanolReadings.current) / 10000.0;
        console.log("Ethanol: " + eth);
        setEthanol(eth.toFixed(2));

        const riskFac = await calculateAndHandleRiskFactor(eth, drinkCountTimestamps.current, highRiskNotificationId);
        setRiskFactor(riskFac);
      } else {
        console.log("No ethanol readings")
      }
      
      ethanolNotificationId.current = await setNotification("Breathalyzer is off!", "To record a reading, hold top button for 5 seconds and wait 10 seconds before blowing into it.");
    } else {
      sensorOn.current = true;
      ethanolNotificationId.current = await setNotification("Breathalyzer is on!", "Please blow into the breathalyzer to record your BAC level.", 2);
    }

    ethanolReadings.current = []
  }

  const handleAddDrinkMessage = async () => {
    setDrinkCount((drinkCount) => drinkCount + 1);
    drinkCountTimestamps.current.push(new Date());

    const riskFac = await calculateAndHandleRiskFactor(ethanol, drinkCountTimestamps.current, highRiskNotificationId);
    setRiskFactor(riskFac);
  }

  const handleSubtractDrinkMessage = async () => {
    drinkCountTimestamps.current.pop();
    setDrinkCount((drinkCount) => (Math.max(drinkCount - 1, 0)));

    const riskFac = await calculateAndHandleRiskFactor(ethanol, drinkCountTimestamps.current, highRiskNotificationId);
    setRiskFactor(riskFac);
  }

  const handleClearDrinksMessage = async () => {
    drinkCountTimestamps.current = [];
    setDrinkCount(0);

    const riskFac = await calculateAndHandleRiskFactor(ethanol, drinkCountTimestamps.current, highRiskNotificationId);
    setRiskFactor(riskFac);
  }

  const handleEthanolMessage = async (message) => {
    const ethanol = message.split(':')[1].trim();

    try {
      ethanolReadings.current.push(parseInt(ethanol));
      console.log("Ethanol readings: " + ethanolReadings.current)
    } catch {
      console.log("Error parsing ethanol reading");
      return;
    }

    clearTimeout(ethanolCalculationTimeoutId.current);
    ethanolCalculationTimeoutId.current = setTimeout(() => {
      const widmark = calculateWidmark(drinkCount, user[0].isMale, user[0].weight);
      setEthanol(widmark.toFixed(2));

      const riskFac = calculateAndHandleRiskFactor(widmark, drinkCountTimestamps.current, highRiskNotificationId);
      setRiskFactor(riskFac);
    }, minutesToMillis(Constants.NOTIFICATION_AFTER_ETHANOL));
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  }

  return {
    devices,
    connectedDevice,
    ethanol,
    drinkCount,
    riskFactor,
    requestPermissions,
    scanForDevices,
    connectToDevice,
    handleMessage,
    disconnectFromDevice,
  };
}