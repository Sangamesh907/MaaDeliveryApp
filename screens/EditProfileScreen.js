import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://3.110.207.229';
const PLACEHOLDER_IMG = 'https://placehold.co/100x100?text=Image';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Load token from AsyncStorage ---
  const loadAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('@delivery_token');
      if (savedToken) setToken(savedToken);
    } catch (err) {
      console.warn('⚠️ Failed to load auth', err);
    }
  };

  useEffect(() => {
    loadAuth();
  }, []);

  // --- Helper to fix image URLs ---
  const fixImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  // --- Fetch profile ---
  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/deliveryme`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      if (!data) return;

      setName(data.name || '');
      setEmail(data.email || '');
      setVehicle(data.vehicle || '');
      setPhone(data.phone_number || '');
      setProfilePic({ uri: fixImageUrl(data.photo_url) } || null);
      setLicenseFront({ uri: fixImageUrl(data.driving_license_front) } || null);
      setLicenseBack({ uri: fixImageUrl(data.driving_license_back) } || null);

      await AsyncStorage.setItem('@delivery_profile', JSON.stringify(data));
    } catch (err) {
      console.warn('⚠️ Failed to fetch profile:', err.message);
      Alert.alert('Error', 'Unable to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // --- Pick image ---
  const pickImage = (setter) => {
    const options = { mediaType: 'photo', quality: 0.6 };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) console.warn('ImagePicker Error: ', response.errorMessage);
      else if (response.assets && response.assets.length > 0) setter(response.assets[0]);
    });
  };

  // --- Update profile ---
  const handleUpdateProfile = async () => {
    if (!token) return Alert.alert('Error', 'Token missing.');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('vehicle', vehicle);

      const appendFile = (fileState, fieldName) => {
        if (fileState && fileState.uri && !fileState.uri.startsWith('http')) {
          formData.append(fieldName, {
            uri: fileState.uri,
            name: fileState.fileName || `${fieldName}.jpg`,
            type: fileState.type || 'image/jpeg',
          });
        }
      };

      appendFile(profilePic, 'file');
      appendFile(licenseFront, 'driving_license_front');
      appendFile(licenseBack, 'driving_license_back');

      // --- POST update ---
      await axios.post(`${BASE_URL}/api/deliveryupdate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });

      // --- Fetch full updated profile ---
      await fetchProfile();

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.warn('❌ Profile update error:', err.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Profile...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: profilePic?.uri || PLACEHOLDER_IMG }}
          style={styles.profileImage}
          onError={() => setProfilePic({ uri: PLACEHOLDER_IMG })}
        />
        <TouchableOpacity style={styles.editPhotoBtn} onPress={() => pickImage(setProfilePic)}>
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.inputWrapper}>
        <Icon name="person-outline" size={20} color="#000" />
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="call-outline" size={20} color="#000" />
        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="mail-outline" size={20} color="#000" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="car-outline" size={20} color="#000" />
        <TextInput placeholder="Vehicle" style={styles.input} value={vehicle} onChangeText={setVehicle} />
      </View>

      {/* Driving License */}
      <Text style={styles.licenseLabel}>Driving License:</Text>
      <View style={styles.licenseRow}>
        <View style={styles.licenseBox}>
          <Text style={styles.cardTypeText}>Front Side</Text>
          <Image
            source={{ uri: licenseFront?.uri || PLACEHOLDER_IMG }}
            style={styles.licenseImage}
            onError={() => setLicenseFront({ uri: PLACEHOLDER_IMG })}
          />
          <TouchableOpacity onPress={() => pickImage(setLicenseFront)}>
            <Text style={styles.uploadText}>Upload Front</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.licenseBox}>
          <Text style={styles.cardTypeText}>Back Side</Text>
          <Image
            source={{ uri: licenseBack?.uri || PLACEHOLDER_IMG }}
            style={styles.licenseImage}
            onError={() => setLicenseBack({ uri: PLACEHOLDER_IMG })}
          />
          <TouchableOpacity onPress={() => pickImage(setLicenseBack)}>
            <Text style={styles.uploadText}>Upload Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateProfile}>
        <Text style={styles.updateBtnText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: '#F9F9F9', padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#ccc' },
  editPhotoBtn: { backgroundColor: '#E5F7F5', padding: 8, borderRadius: 20, marginTop: 10 },
  editPhotoText: { color: '#0A8F72', fontWeight: 'bold' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 1,
  },
  input: { marginLeft: 10, flex: 1, color: '#000', padding: 8 },
  licenseLabel: { fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 10 },
  licenseRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  licenseBox: { backgroundColor: '#fff', padding: 10, width: '47%', borderRadius: 10, alignItems: 'center', elevation: 2 },
  cardTypeText: { fontSize: 12, color: '#666', marginBottom: 5 },
  licenseImage: { width: '100%', height: 100, borderRadius: 10, marginBottom: 10, resizeMode: 'cover' },
  uploadText: { color: '#F54747', fontWeight: 'bold', fontSize: 14, padding: 5, borderWidth: 1, borderColor: '#F54747', borderRadius: 5 },
  updateBtn: { backgroundColor: '#F54747', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, elevation: 3 },
  updateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default EditProfileScreen;
