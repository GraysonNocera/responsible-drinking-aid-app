import { useMemo, useRef } from 'react';
import LocationService from '../services/location';

export default function useLocation() {
  const currentLocation = useRef(null);
  const formattedAddress = useMemo(fetchFormattedAddress, [currentLocation]);

  const updateCurrentLocation = () => {
    LocationService.getCurrentLocation(
      (location) => {
        currentLocation.current = location;
      },
      (error) => {
        console.error(`Error getting location: ${error}`);
      }
    );
  };

  const fetchFormattedAddress = async () => {
    if (!currentLocation.current) {
      console.log('No current location; cannot fetch address');
      return;
    }

    try {
      console.log(`Fetching address for ${currentLocation.current.latitude}, ${currentLocation.current.longitude}`)

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=GOOGLEAPIKEYHERE`
      );
      const data = await response.json();
      console.log("API call returned data: ", data)

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.error(`Error fetching address: ${error}`);
    }
  };

  return {
    updateCurrentLocation,
    currentLocation,
    formattedAddress,
  }
}