import Geolocation from "@react-native-community/geolocation";

class LocationService {
  
  init = () => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false, // set this to true to disable request for location permission
      authorizationLevel: 'whenInUse', // maybe 'always' ?
    });
  };

  getCurrentLocation = (successCallback, errorCallback) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        successCallback({ latitude, longitude });
      },
      (error) => {
        errorCallback(error.message);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
    );
  };
}

export default new LocationService();