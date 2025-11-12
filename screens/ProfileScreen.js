import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { DeliveryContext } from '../Context/DeliveryContext';

const DEFAULT_PROFILE_URI = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=PROFILE';
const BASE_URL = 'http://3.110.207.229';

const getProfileImageUri = (name) => {
  if (!name) return DEFAULT_PROFILE_URI;
  const fileName = name.replace(/\s+/g, '') + '.png';
  return `${BASE_URL}/static/chefprofile/${fileName}`;
};

const fixBackendPath = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

const ProfileScreen = ({ navigation }) => {
  const { token, logout } = useContext(DeliveryContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh
  const [profileImageError, setProfileImageError] = useState(false);

  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleOrderHistory = () => navigation.navigate('OrderHistory');
  const handleEarnings = () => navigation.navigate('Earnings');
  const handleTransactions = () => navigation.navigate('Transactions');
  const handleBankAccount = () => navigation.navigate('BankAccount');
  const handleCustomerSupport = () => navigation.navigate('CustomerSupport');
  const handleFAQs = () => navigation.navigate('FAQ');
  const handleTerms = () => navigation.navigate('TermsAndConditions');
  const handlePrivacyPolicy = () => navigation.navigate('PrivacyPolicy');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          console.log('[Profile] 🔒 User logging out...');
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
        style: 'destructive',
      },
    ]);
  };

  const fetchProfile = async () => {
    if (!token) {
      console.warn('[Profile] ⚠️ Token missing, cannot fetch profile.');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (!refreshing) setLoading(true); // Only show full loader if not pull-to-refresh
      console.log('[Profile] ⏱️ Fetching profile...');
      const res = await axios.get(`${BASE_URL}/api/deliveryme`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        console.log('[Profile] 📌 Profile data set successfully', res.data);
        setProfileData(res.data);
        setProfileImageError(false);
      } else {
        console.warn('[Profile] ⚠️ No profile data found in response.');
        Alert.alert('Error', 'No profile data found');
        setProfileData(null);
      }
    } catch (err) {
      console.warn('[Profile] ❌ Fetch profile error:', err?.message || err);
      Alert.alert('Error', 'Unable to fetch profile');
      setProfileData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('[Profile] ⏱️ fetchProfile finished');
    }
  };

  useEffect(() => {
    fetchProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [token, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const ProfileItem = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.itemIconContainer}>{icon}</View>
      <Text style={styles.itemText}>{text}</Text>
      <Feather name="chevron-right" size={24} color="#aaa" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No profile data available. Please try logging in again.</Text>
      </View>
    );
  }

  const photoUrlFromDB = fixBackendPath(profileData.photo_url);
  const heuristicUri = getProfileImageUri(profileData.name);
  const initialProfileUri = photoUrlFromDB || heuristicUri;
  const profileSourceUri = profileImageError ? DEFAULT_PROFILE_URI : initialProfileUri;

  const licenseFrontUri = fixBackendPath(profileData.driving_license_front);
  const licenseBackUri = fixBackendPath(profileData.driving_license_back);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profileSourceUri }}
            style={styles.profileImage}
            onError={(e) => {
              console.warn(`[Profile] ⚠️ Failed to load image: ${initialProfileUri}. Falling back to default.`);
              setProfileImageError(true);
            }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.contact}>{profileData.email}</Text>
            <Text style={styles.contact}>{profileData.phone_number}</Text>
            <Text style={styles.contact}>Vehicle: {profileData.vehicle}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="pencil-outline" size={20} color="#000" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <ProfileItem
            icon={<FontAwesome5 name="history" size={22} color="#4CAF50" />}
            text="Order History"
            onPress={handleOrderHistory}
          />
          <ProfileItem
            icon={<FontAwesome5 name="rupee-sign" size={22} color="#4CAF50" />}
            text="Earnings"
            onPress={handleEarnings}
          />
          <ProfileItem
            icon={<FontAwesome5 name="money-bill-wave" size={22} color="#4CAF50" />}
            text="Transactions"
            onPress={handleTransactions}
          />
          <ProfileItem
            icon={<FontAwesome5 name="university" size={22} color="#4CAF50" />}
            text="Bank Account"
            onPress={handleBankAccount}
          />
          <ProfileItem
            icon={<Ionicons name="headset-outline" size={22} color="#4CAF50" />}
            text="Customer Support"
            onPress={handleCustomerSupport}
          />
          <ProfileItem
            icon={<FontAwesome5 name="question-circle" size={22} color="#4CAF50" />}
            text="FAQ's"
            onPress={handleFAQs}
          />
          <ProfileItem
            icon={<Feather name="file-text" size={22} color="#4CAF50" />}
            text="Terms and Conditions"
            onPress={handleTerms}
          />
          <ProfileItem
            icon={<Feather name="shield" size={22} color="#4CAF50" />}
            text="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  profileImage: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold' },
  contact: { fontSize: 14, color: '#888' },
  editButton: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0' },
  editButtonText: { marginLeft: 5, fontWeight: 'bold' },
  optionsContainer: { backgroundColor: '#f9f9f9', padding: 10, paddingBottom: 5 },
  profileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, marginVertical: 5, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  itemIconContainer: { width: 40, alignItems: 'center' },
  itemText: { flex: 1, fontSize: 16, marginLeft: 15 },
  logoutButton: { backgroundColor: 'transparent', borderColor: '#4CAF50', borderWidth: 1.5, borderRadius: 25, paddingVertical: 12, marginHorizontal: 30, marginTop: 20, marginBottom: 20, alignItems: 'center' },
  logoutButtonText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  licensesContainer: { padding: 20 },
  licenseTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  licenseImages: { flexDirection: 'row', justifyContent: 'space-between' },
  licenseImage: { width: '48%', height: 120, borderRadius: 8, backgroundColor: '#f0f0f0' },
});

export default ProfileScreen;
