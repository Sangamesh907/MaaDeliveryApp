import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    console.log('🟢 SplashScreen mounted');

    const requestLocation = async () => {
      try {
        console.log('📌 Requesting location permission...');
        let granted = Platform.OS === 'ios' ? true : false;

        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location for delivery tracking.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          granted = result === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (granted) {
          console.log('✅ Location permission granted. Fetching current position...');
          Geolocation.getCurrentPosition(
            position => {
              console.log('📍 Location fetched safely:', position);
              navigation.replace('Login');
              console.log('➡ Navigating to Login screen');
            },
            error => {
              console.warn('⚠️ Location error:', error);
              navigation.replace('Login'); // fail gracefully
              console.log('➡ Navigating to Login screen despite error');
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
          );
        } else {
          console.warn('⚠️ Location permission denied');
          navigation.replace('Login');
          console.log('➡ Navigating to Login screen due to denied permission');
        }
      } catch (err) {
        console.warn('⚠️ Splash location crash prevented:', err);
        navigation.replace('Login');
        console.log('➡ Navigating to Login screen after exception');
      }
    };

    const timer = setTimeout(() => {
      console.log('⏱ Splash timer ended, requesting location...');
      requestLocation();
    }, 1500);

    return () => {
      clearTimeout(timer);
      console.log('🟡 SplashScreen unmounted, timer cleared');
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo31.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
