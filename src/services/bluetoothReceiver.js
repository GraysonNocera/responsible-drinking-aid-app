import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { setNotification } from '../services/notifications';
import { Characteristic } from 'react-native-ble-plx';
import { Observable, concatMap, share } from 'rxjs';
import * as Location from 'expo-location';

// Observations about Bluetooth:
// - The device must be paired with the phone before it can be connected to
// - The device must be connected to before it can be discovered
// - The device must be discovered before its services and characteristics can be discovered
// - Those first 3 came from GitHub copilot
// - Our app needs to have location permissions turned on for bluetooth to work
// - If I just did a general scan, it didn't work, but if I scanned for the specific UUID of our device, it worked
// - There is a monitor function in this library in which it seems like we can setup different
//    data streams for each type of data we receive (button press, heart rate, bac, etc.)
// - We will have to connect the monitor to I think a hook in our app so that the UI can update when we 
//    receive new data

export const BluetoothMessages = {
  addDrink: "Add Drink",
  subtractDrink: "Subtract Drink",
  clearDrinks: "Clear Drinks",
  drinkTimerStart: "Drink Timer Start",
  drinkTimerReset: "Drink Timer Reset",
  ethanolSensorOn: "Ethanol Sensor On",
  ethanolSensorOff: "Ethanol Sensor Off",
	ethanol: "BAC",
  adc: "ADC",
  heartRate: "Heart Rate",
}

export default class BluetoothReceiver {

  // Adapted from https://stackoverflow.com/questions/44023879/react-native-best-way-to-create-singleton-pattern
  static instance = null;
  static createInstance() {
      var object = new BluetoothReceiver();
      return object;
  }

  static getInstance () {
      if (!BluetoothReceiver.instance) {
        BluetoothReceiver.instance = BluetoothReceiver.createInstance();
      }
      return BluetoothReceiver.instance;
  }

  constructor() {
    this.manager = new BleManager();
    this.device = null; // the device we are connected to
    this.serviceUUID = 'FFE0'; // service UUID for HM19
    this.characteristicUUID = 'FFE1'; // characteristic UUID for HM19
    this.deviceName = 'DSD TECH'; // name of the device we are connecting to
    this.observable = null; // the observable that we will use to receive data from the device
  }

  setHooks(setDrinkCount, setEthanol, setHeartRate) {
    this.setDrinkCount = setDrinkCount;
    this.setEthanol = setEthanol;
    this.setHeartRate = setHeartRate;
  }

  setTimerHooks(notificationId, setnotificationId) {
    this.notificationId = notificationId
    this.setnotificationId = setnotificationId
  }

  initializeBluetooth() {
    if (this.device) {
      return;
    }

    let permissions = new Observable((subscriber) => {
      Location.getForegroundPermissionsAsync().then((permissions) => {
        subscriber.next(permissions);
        subscriber.complete();
      });
    });

    let connect = permissions
    .pipe(concatMap((permissions) => {
      if (permissions.status == 'granted') {
        console.log('Location permissions granted');

        return new Observable((subscriber) => {
          this.manager.startDeviceScan([this.serviceUUID, this.characteristicUUID], null, async (error, device) => {
            if (error) {
              console.log('Error scanning for devices:', error);
              subscriber.error(error);
            }

            console.log('Found device:', device.name);
            this.manager.stopDeviceScan();

            if (device.name == this.deviceName) {
              console.log('Found our device!');
              this.device = device;
              await this.device.connect();
              console.log('Connected to device!');
              await this.device.discoverAllServicesAndCharacteristics();
              console.log('Discovered all services and characteristics!');
              subscriber.next(true);
              subscriber.complete();
            }
          });
        });
      } else {
        return new Observable((subscriber) => {
          subscriber.error('Cannot connect because location permissions not granted');
        });
      }
    }));

    let monitor = connect
    .pipe(concatMap((connect) => {
      console.log('Connect: ', connect)

      if (connect) { 
        console.log('Connected to bluetooth device');
        return new Observable((subscriber) => {
          this.manager.monitorCharacteristicForDevice(this.device.id, this.serviceUUID, this.characteristicUUID, (error, char) => {
            if (error) {
              subscriber.error(error);
            }
            subscriber.next(Buffer.from(char.value, 'base64').toString('ascii').trim());
          })
        });
      } else {
        console.log('Not connected to bluetooth device')
        return new Observable((subscriber) => {
          subscriber.error('Cannot monitor because not connected to bluetooth device');
        });
      }
    }), share());

    console.log('Monitor: ', monitor)

    return monitor;
  }

  receiveData(error, char) {
    if (error) {
      console.error('Error monitoring characteristic:', error);
      return;
    }

    // Types of data that we can receive:
    // - Drink number button press
    // - Heart rate
    // - Ethanol level
    // - Ethanol notification
    // - error messages
    const receivedData = Buffer.from(char.value, 'base64').toString('ascii').trim();
    console.log('Received data:', receivedData);
    
    if (receivedData.startsWith(BluetoothMessages.heart)) {
      console.log('Received heart rate');
      BluetoothReceiver.instance.setHeartRate(parseInt(receivedData.split(':')[1]));
    } else if (receivedData.startsWith(BluetoothMessages.ethanol)) {
      console.log('Received ethanol level');
      const eth = parseInt(receivedData.split(':')[1]);

      // TODO: find some threshold below which we consider it to just be noise
      if (eth > 20) {
        BluetoothReceiver.instance.setEthanol(eth);
      }

      // Clear previous interval and start new one that goes off in 30 minutes
      
      clearInterval(BluetoothReceiver.instance.notificationId);
      BluetoothReceiver.instance.setnotificationId(setTimeout(() => {
        setNotification('Drink Alert', 'Please if you have any decencies stop drinking alcohol');
      }, 1000 * 10));

    } else if (receivedData == BluetoothMessages.drink) {
      // console.log('Received drink button press');
      BluetoothReceiver.instance.setDrinkCount(drinkCount => drinkCount + 1);
      // Clear previous interval and start new one that goes off in 30 minutes
      clearInterval(BluetoothReceiver.instance.notificationId);
      BluetoothReceiver.instance.setnotificationId(setNotification('Drink Alert', 'You just consumed a drink', 1));

    } else if (receivedData == BluetoothMessages.ethanolNotification) {
      console.log('Received ethanol notification');
      // Notify user that they should use ethanol sensor
    } else if (receivedData.startsWith(BluetoothMessages.battery)) {
      console.log('Received battery level');
      // TODO - update battery level
    } else {
      console.log('Received unknown data:', receivedData);
    }
  }

  convertToCharacteristic(value) {
    // Convert string to react-native-ble-plx Characteristic

    let c = new Characteristic();
    c.value = Buffer.from(value).toString('base64')
    c.manager = BluetoothReceiver.instance.manager

    return c
  }

  disconnectDevice() {
    if (this.device) {
      this.device.cancelConnection();
      console.log('Disconnected from the device');
    }
  }
}
