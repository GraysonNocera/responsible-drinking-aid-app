import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

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

const BluetoothMessages = {
	drink: "Drink Consumed",
	heart: "Heart Rate",
	ethanol: "BAC",
  ethanolNotification: "ethanolNotification",
  // error messages
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
  }

  setHooks(setDrinkCount, setEthanol, setHeartRate) {
    this.setDrinkCount = setDrinkCount;
    this.setEthanol = setEthanol;
    this.setHeartRate = setHeartRate;
  }

  initializeBluetooth() {
    if (this.device) {
      return
    }

    try {
      this.manager.startDeviceScan([this.serviceUUID, this.characteristicUUID], null, async (error, device) => {
        if (error) {
          console.error('Error scanning for devices:', error);
          return;
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
          // const characteristic = await this.device.readCharacteristicForService(this.serviceUUID, this.characteristicUUID);
          // console.log('Read characteristic:', characteristic.value);
          this.manager.monitorCharacteristicForDevice(this.device.id, this.serviceUUID, this.characteristicUUID, this.receiveData);
        }

      });
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
    }
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

    if (receivedData.startsWith(BluetoothMessages.drink)) {
      console.log('Received drink button press');
      BluetoothReceiver.instance.setDrinkCount(drinkCount => drinkCount + 1);
    } else if (receivedData.startsWith(BluetoothMessages.ethanol)) {
      console.log('Received ethanol level');
      BluetoothReceiver.instance.setEthanol(parseInt(receivedData.split(':')[1]));
      // write to realm
    }

    switch (receivedData) {
      case BluetoothMessages.drink:
        console.log('Received drink button press');
        BluetoothReceiver.instance.setDrinkCount(drinkCount => drinkCount + 1);
        // write to realm
        break;
      case BluetoothMessages.ethanolNotification:
        console.log('Received ethanol notification');
        // Notify user that they should use ethanol sensor
        break;
      case receivedData.startsWith(BluetoothMessages.heart):
        console.log('Received heart rate');
        BluetoothReceiver.instance.setHeartRate(receivedData.split(':')[1].parseInt());
        // write to realm
        break;
      case receivedData.startsWith(BluetoothMessages.ethanol):
        console.log('Received ethanol level');
        BluetoothReceiver.instance.setEthanol(receivedData.split(':')[1].parseInt());
        // write to realm
        break;
      default:
        console.log('Received unknown data: ', receivedData);
        break;
    }
  }

  disconnectDevice() {
    if (this.device) {
      this.device.cancelConnection();
      console.log('Disconnected from the device');
    }
  }
}
