// screens/OngoingOrders.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { DeliveryContext } from '../Context/DeliveryContext';

const OrderCard = ({ order }) => {
  const navigation = useNavigation();

  const chefName = order.chef?.name || 'Unknown Chef';
  const chefPhoto = order.chef?.profile_pic
    ? { uri: `http://3.110.207.229${order.chef.profile_pic}` }
    : null;
  const chefInitials = chefName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const deliveryArea = order.address?.area || 'N/A';
  const customerName = order.customer?.name || 'Customer';
  const amount = order.total_price || 0;
  const earnings = Math.floor(amount * 0.15);
  const status = order.delivery_status || 'Ongoing';

  const items =
    Array.isArray(order.items) && order.items.length > 0
      ? order.items.map(i => `${i.quantity}x ${i.food_name || 'Item'}`).join(', ')
      : 'N/A';

  const handleCall = phoneNumber => {
    if (!phoneNumber) return Alert.alert('Error', 'Chef phone number not available');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Navigate to OrderDetailsScreen
  const openOrderDetails = () => {
    navigation.navigate('OrderDetails', { order });
  };

  return (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.9} onPress={openOrderDetails}>
      {/* Chef Info */}
      <View style={styles.chefInfoContainer}>
        {chefPhoto ? (
          <Image source={chefPhoto} style={styles.chefImage} />
        ) : (
          <View
            style={[
              styles.chefImage,
              { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
            ]}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{chefInitials}</Text>
          </View>
        )}

        <View style={styles.chefDetails}>
          <Text style={styles.chefName}>{chefName}</Text>
          <Text style={styles.chefLocation}>{status}</Text>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(order.chef?.phone)}>
          <Ionicons name="call" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Order Details */}
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.detailLabel}>Items</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {items}
        </Text>

        <View style={styles.detailRow}>
          <View>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>₹ {amount}</Text>
          </View>
          <View>
            <Text style={styles.amountLabel}>Your Earnings</Text>
            <View style={styles.earningsRow}>
              <Feather name="trending-up" size={16} color="#D82A2A" />
              <Text style={styles.earningsValue}>₹ {earnings}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.detailLabel}>Customer</Text>
        <Text style={styles.detailValue}>{customerName}</Text>

        <Text style={styles.detailLabel}>Delivery Address</Text>
        <Text style={styles.detailValue}>{deliveryArea}</Text>
      </View>

      {/* Navigate button (optional, still navigates to same screen) */}
      <TouchableOpacity style={styles.navigateButton} onPress={openOrderDetails}>
        <Feather name="send" size={18} color="#fff" style={styles.navigateIcon} />
        <Text style={styles.navigateButtonText}>Navigate</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const OngoingOrders = () => {
  const { token } = useContext(DeliveryContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mockOrders = [
    {
      _id: '1',
      chef: { name: 'Sangamesh', phone: '9611523269', profile_pic: null },
      customer: { name: 'Kailash' },
      address: { area: 'MG Road' },
      total_price: 300,
      delivery_status: 'assigned',
      items: [{ quantity: 2, food_name: 'Paneer Butter Masala' }],
    },
    {
      _id: '2',
      chef: { name: 'Ravi', phone: '9876543210', profile_pic: null },
      customer: { name: 'Priya' },
      address: { area: 'Brigade Road' },
      total_price: 450,
      delivery_status: 'preparing',
      items: [{ quantity: 1, food_name: 'Veg Biryani' }],
    },
  ];

  const fetchOrders = async () => {
    if (!token) {
      setOrders(mockOrders);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://3.110.207.229/api/ongoing/delivery/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data.length ? data : mockOrders);
      } else if (data.status === 'success' && Array.isArray(data.orders)) {
        setOrders(data.orders.length ? data.orders : mockOrders);
      } else {
        setOrders(mockOrders);
      }
      setLoading(false);
    } catch (err) {
      console.warn('⚠️ Error fetching orders:', err);
      setOrders(mockOrders);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Ongoing Orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollViewContent}
      />
    </SafeAreaView>
  );
};

export default OngoingOrders;

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollViewContent: { paddingHorizontal: 10, paddingTop: 15, paddingBottom: 20 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chefInfoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chefImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  chefDetails: { flex: 1 },
  chefName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chefLocation: { fontSize: 13, color: '#777' },
  callButton: { padding: 6, borderRadius: 20, backgroundColor: '#e6f4ea' },
  orderDetailsContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  detailLabel: { fontSize: 14, color: '#555', fontWeight: 'bold', marginTop: 5 },
  detailValue: { fontSize: 14, color: '#333', marginLeft: 5 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  amountLabel: { fontSize: 12, color: '#555' },
  amountValue: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50' },
  earningsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  earningsValue: { fontSize: 14, color: '#D82A2A', marginLeft: 5, fontWeight: 'bold' },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  navigateIcon: { marginRight: 8 },
  navigateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
});
