import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { RealmProvider } from '@realm/react';
import { BluetoothReceiver } from './src/services/BluetoothReceiver';
import Home from './src/pages/Home';
import Settings from './src/pages/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  // TODO - ask user for location permissions (otherwise bluetooth fails)
  // let bluetoothReceiver = new BluetoothReceiver();
  // bluetoothReceiver.initializeBluetooth();
  // Open a realm.

  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
}
