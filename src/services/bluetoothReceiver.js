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

export class BluetoothReceiver {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.serviceUUID = 'FFE0';
    this.characteristicUUID = 'FFE1';
  }

  async initializeBluetooth() {
    try {
      this.manager.startDeviceScan(['FFE0', 'FFE1'], null, async (error, device) => {
        if (error) {
          console.error('Error scanning for devices:', error);
          return;
        }

        console.log('Found device:', device.name);
        this.manager.stopDeviceScan();

        if (device.name == "DSD TECH") {
          console.log('Found our device!');
          this.device = device;
          await this.device.connect();
          console.log('Connected to device!');
          await this.device.discoverAllServicesAndCharacteristics();
          console.log('Discovered all services and characteristics!');
          const characteristic = await this.device.readCharacteristicForService(this.serviceUUID, this.characteristicUUID);
          console.log('Read characteristic:', characteristic.value);

          this.manager.monitorCharacteristicForDevice(this.device.id, this.serviceUUID, this.characteristicUUID, (error, char) => {
            if (error) {
              console.error('Error monitoring characteristic:', error);
              return;
            }
    
            const receivedData = char.value;
            console.log('Received data:',Buffer.from(receivedData, 'base64').toString('ascii'));
          });
        }

      });
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
    }
  }

  disconnectDevice() {
    if (this.device) {
      this.device.cancelConnection();
      console.log('Disconnected from the device');
    }
  }
}
