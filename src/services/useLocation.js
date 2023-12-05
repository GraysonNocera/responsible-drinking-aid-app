import { useRef } from 'react';
import LocationService from '../services/location';

export default function useLocation() {
  // Methodology: How often do we want to grab the user's location? How often should we grab the user's location?
  // Judging by this: https://developers.google.com/maps/billing-and-pricing/pricing#geocoding
  // it's half a cent per call. 

  const cachedLocation = useRef({latitude: 0, longitude: 0});
  const cacheFormattedAddress = useRef("");

  const updateCurrentLocation = (callback) => {
    LocationService.getCurrentLocation(
      (location) => {
        console.log(`Got location: ${JSON.stringify(location)}`);
        callback(location, null);
      },
      (error) => {
        console.error(`Error getting location: ${error}`);
        callback(null, error);
      }
    );
  };

  const fetchFormattedAddress = async (latitude, longitude) => {
    // TODO: Figure out how to check the cached value against the values passed in
    if (Math.abs(cachedLocation.current.latitude - latitude) < 1e-3 && Math.abs(cachedLocation.current.longitude - longitude) < 1e-3) {
      console.log("Returning cached address")
      return cacheFormattedAddress.current;
    } else {
      cachedLocation.current.latitude = latitude;
      cachedLocation.current.longitude = longitude;
    }

    try {
      console.log(`Fetching address for ${latitude}, ${longitude}`)

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEuHknMmZUvjguhG8UFVQu5j3ZISQqPSI`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        cacheFormattedAddress.current = data.results[0].formatted_address;
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.error(`Error fetching address: ${error}`);
      return null;
    }
  };

  return {
    updateCurrentLocation,
    fetchFormattedAddress
  }
}