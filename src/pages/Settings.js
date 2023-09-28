import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <TextInput inputMode="text" placeholder="Height" />
      <Button title="Home"
        onPress={() => navigation.navigate('Home')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});