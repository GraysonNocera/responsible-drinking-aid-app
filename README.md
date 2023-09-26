# Responsible Drinking Aid

## Background

This mobile app, in conjunction with the microcontroller linked [INSERT REPO LINK HERE], is designed to provide a comprehensive solution for addressing the potential challenges associated with alcohol consumption. Our goal is to create a user-friendly platform that enhances safety, promotes responsible drinking, and offers support in various ways. Whether it's monitoring biometric data, providing helpful tips, or connecting users with relevant resources, this app and microcontroller combination will contribute to a more informed and responsible drinking experience.

## Build Instructions
[THIS IS IN PROCESS. STILL TRYING TO FIGURE OUT BLUETOOTH]
1. Clone and enter the directory:
```git clone git@github.com:GraysonNocera/responsible-drinking-aid-app.git && cd responsible-drinking-aid-app```
2. Install dependencies:
```npm install```
3. An intermediate step might be to configure EAS (for Bluetooth testing purposes... you'll need an Expo user account):
```eas build:configure```
Follow the instructions.
4. Install the config-plugins/react-native-ble-plx plugin
```npx expo install react-native-ble-plx @config-plugins/react-native-ble-plx```
5. Register as an Apple Developer: [https://developer.apple.com/register/](https://developer.apple.com/register/)
6. Build the development version of the app
    ```npx eas build --profile development --platform ios```
    Log in using your Apple ID; I've found that 
7. Run server:
```npx expo start```

## Android Studio

[Maybe include some documentation here about how to use Android Studio? Expo Go does not support bluetooth]
First, `npm install`
`npx expo start`
