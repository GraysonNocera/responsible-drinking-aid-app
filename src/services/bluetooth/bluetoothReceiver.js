import { BleManager } from 'react-native-ble-plx';

class BluetoothReceiver {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.serviceUUID = 'service_uuid_here';
    this.characteristicUUID = 'characteristic_uuid_here';
  }

  async initializeBluetooth() {
    try {
      const device = await this.manager.connectToDevice({ id: 'DeviceId' });
      await device.discoverAllServicesAndCharacteristics();

      const characteristic = await device.monitorCharacteristicForService(
        this.serviceUUID,
        this.characteristicUUID,
        (error, char) => {
          if (error) {
            console.error('Error monitoring characteristic:', error);
            return;
          }

          const receivedData = char.value;
          console.log('Received data:', receivedData);
        }
      );

      this.device = device;
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

export default new BluetoothReceiver();
