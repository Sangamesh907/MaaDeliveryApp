import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { DeliveryContext } from '../Context/DeliveryContext';

const OtpScreen = ({ route, navigation }) => {
  const { mobile, isNewUser } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const { deliveryId, token, setIsOnline } = useContext(DeliveryContext);

  const handleOtpChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 5) inputRefs.current[index + 1]?.focus();
    if (!text && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleFakeVerify = async () => {
    console.log('✅ Fake OTP verification');

    Alert.alert('Success', 'Logged in successfully!');

    // Mark online immediately
    setIsOnline(true);
    console.log('🌐 isOnline set to true in context');

    // Navigate to next screen
    navigation.reset({
      index: 0,
      routes: [{ name: isNewUser ? 'EditProfile' : 'MainTabs' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>OTP sent to +91 {mobile}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleFakeVerify}>
        <Text style={styles.verifyText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff5858',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 30 },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpBox: {
    backgroundColor: '#fff',
    width: 45,
    height: 55,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  verifyText: {
    color: '#ff5858',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OtpScreen;
