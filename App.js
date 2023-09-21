import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import bluetoothReceiver from './src/services/bluetooth/bluetoothReceiver';

export default function App() {
  bluetoothReceiver.initializeBluetooth();
  return (
    <View style={styles.container}>
      <Text>We love ECE 477! No we don't</Text>
      <StatusBar style="auto" />
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
});