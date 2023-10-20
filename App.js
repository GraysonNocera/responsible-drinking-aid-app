import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { RealmProvider } from '@realm/react';
import React from 'react';
import Home from './src/pages/Home';
import Settings from './src/pages/Settings';
import Emergency from './src/pages/Emergency';
import { setupNotifications } from './src/services/notifications';

const Stack = createNativeStackNavigator();

export default function App() {
  // TODO - ask user for location permissions (otherwise bluetooth fails)
  // TODO - bluetooth here or on home screen?

  // Setup notifications
  setupNotifications();

  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Emergency" component={Emergency} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
}
