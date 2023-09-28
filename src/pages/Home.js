import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useRealm } from '@realm/react';

export default function Home({ navigation }) {
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
