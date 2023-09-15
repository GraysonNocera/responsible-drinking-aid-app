import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { Session } from './src/model/Session';
import {createRealmContext} from '@realm/react';
import React from 'react';
import Realm from 'realm';
import { User } from './src/model/User';

// Create a configuration object
const realmConfig = {
  schema: [Session, User],
};

// Create a realm context
const {RealmProvider, useRealm, useObject, useQuery} =
  createRealmContext(realmConfig);

function HomeScreen({ navigation }) {
  const realm = useRealm();
  return (
    <View style={styles.container}>
      <Text>BAC: 100</Text>
      <Text>Heartrate: 100</Text>
      <Button title="Settings"
        onPress={() => {
          navigation.navigate('Settings')
          realm.write(() => {
            realm.create('User', {
              height: 100,
              weight: 100,
              _id: new Realm.BSON.ObjectId(),
            });
          });
        }} />
      <StatusBar style="auto" />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <TextInput inputMode="text" placeholder="Height" />
      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
      <StatusBar style="auto" />
    </View>
  )
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
<<<<<<< HEAD
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
=======
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> c1c0131 (expo stuff)
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
