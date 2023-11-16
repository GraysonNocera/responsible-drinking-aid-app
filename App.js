import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { RealmProvider } from '@realm/react';
import React, { useEffect } from 'react';
import Home from './src/pages/Home';
import Settings from './src/pages/Settings';
import Emergency from './src/pages/Emergency';
import Dev from './src/pages/Dev';
import { setupNotifications } from './src/services/notifications';
import realmConfig from './src/services/db.js'
import { LogBox } from 'react-native';
import LocationService from './src/services/location';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const Stack = createNativeStackNavigator();

export default function App() {
  // TODO - ask user for location permissions (otherwise bluetooth fails)
  // TODO - bluetooth here or on home screen?

  useEffect(() => {
    setupNotifications();
    LocationService.init();
  }, []);

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
