import React, { useEffect, useState } from 'react';
import { View, Text, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocation(); // Call when component mounts
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for delivery tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS automatically asks for permission
      return true;
    }
  };

 const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      if (position && position.coords) {
        setLocation(position);
        console.log('Current location:', position);
      } else {
        console.warn('⚠️ Position is null or malformed');
      }
    },
    error => {
      console.warn('⚠️ Location fetch error:', error);
      Alert.alert('Error', 'Failed to get current location');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};


  const requestLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      getCurrentLocation();
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {location
          ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
          : 'Fetching location...'}
      </Text>
    </View>
  );
};

export default LocationScreen;
