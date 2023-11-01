import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { RealmProvider } from '@realm/react';
import React, { Component } from 'react';
import Home from './src/pages/Home';
import Settings from './src/pages/Settings';
import Emergency from './src/pages/Emergency';
import Dev from './src/pages/Dev';
import { setupNotifications } from './src/services/notifications';
import realmConfig from './src/services/db.js'
import { LogBox } from 'react-native';
import bluetoothReceiver from './src/services/bluetoothReceiver';

LogBox.ignoreLogs(['new NativeEventEmitter()']); // Ignore log notification by message

const Stack = createNativeStackNavigator();

export default class App extends Component {
  // TODO - ask user for location permissions (otherwise bluetooth fails)
  // TODO - bluetooth here or on home screen?

  componentDidMount() {

    let bl = bluetoothReceiver.getInstance();
    let result = bl.initializeBluetooth();
    result.subscribe(
      (value) => {
        console.log('value: ', value);
      },
      (error) => {
        console.log('error', error);
      },
      () => {
        console.log('complete');
      }
    );

    let res2 = bl.initializeBluetooth();
    res2.subscribe(
      (value) => {
        console.log('value2: ', value);
      },
      (error) => {
        console.log('error', error);
      },
      () => {
        console.log('complete');
      }
    );

    // Setup notifications
    setupNotifications();
  }

  render() {
    return (
      <RealmProvider {...realmConfig}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Emergency" component={Emergency} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Dev" component={Dev} />
          </Stack.Navigator>
        </NavigationContainer>
      </RealmProvider>
    );
  }
}
