import { useEffect, useRef } from 'react';
import LocationService from '../services/location';

export default function useLocation() {
  const currentLocation = useRef(null);
  const formattedAddress = useRef('');

  const updateCurrentLocation = (callback=null) => {
    LocationService.getCurrentLocation(
      (location) => {
        // location.latitude = location.latitude.toFixed(1);
        // location.longitude = location.longitude.toFixed(1);
        console.log(`Got location: ${JSON.stringify(location)}`);
        currentLocation.current = location;
        if (callback) {
          callback(location);
        }
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.current.latitude},${currentLocation.current.longitude}&key=AIzaSyDEuHknMmZUvjguhG8UFVQu5j3ZISQqPSI`
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

  useEffect(() => {
    console.log("Updating current location in useEffect")
    updateCurrentLocation((location) => {
      console.log(`Location updated: ${JSON.stringify(location)}`);
      fetchFormattedAddress().then((address) => {
        formattedAddress.current = address;
      });
    });
  }, []);

  useEffect(() => {
    fetchFormattedAddress().then((address) => {
      formattedAddress.current = address;
    });
  }, [currentLocation]);

  return {
    updateCurrentLocation,
    fetchFormattedAddress,
    currentLocation,
    formattedAddress,
  }
}