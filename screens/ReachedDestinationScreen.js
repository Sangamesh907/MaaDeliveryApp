import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import { DeliveryContext } from '../Context/DeliveryContext';

const API_BASE = 'http://3.110.207.229';

// Reusable component for the status steps
const StatusItem = ({ icon, title, subtitle, time, isComplete }) => (
  <View style={styles.statusItem}>
    <MaterialIcons
      name={isComplete ? 'check-circle' : icon}
      size={24}
      color={isComplete ? '#00C851' : '#ccc'}
      style={styles.statusIcon}
    />
    <View style={{ flex: 1 }}>
      <Text style={[styles.statusTitle, {color: isComplete ? '#333' : '#999'}]}>{title}</Text>
      <Text style={styles.statusSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.statusTime}>
      {time || '--:--'}
    </Text>
  </View>
);

const ReachedDestinationScreen = ({ route, navigation }) => {
  const { orderId, customerCoords: routeCustomerCoords, chefCoords: routeChefCoords, initialStatus } = route.params || {};
  const { updateOrderStatus, authApi, deliveryId } = useContext(DeliveryContext);

  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null); // Should be set by global tracking
  const [loading, setLoading] = useState(true);

  // --- Fetch Order and Driver Location (for context) ---
  const loadData = async () => {
    // 1. Fetch Order Details (Using the same tracking API or direct order get)
    try {
      const res = await authApi('get', `/deliveryordertrack/${orderId}`);
      if (res.data.status === 'success' && res.data.order) {
        setOrder(res.data.order);
      } else {
        Alert.alert('Error', 'Order not found');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load order data');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
    
    // 2. Mocking driver location as being at customer destination for this screen
    // Ideally, this comes from a global state or a dedicated API endpoint
    // We'll use the customer location as a placeholder for the driver's current position
    if (routeCustomerCoords && routeCustomerCoords.length === 2) {
        setDriverLocation({
            longitude: routeCustomerCoords[0],
            latitude: routeCustomerCoords[1],
        });
    }
  };
  
  useEffect(() => {
    loadData();
  }, [orderId]);


  // --- Handle Mark Delivered (Collect Payment) ---
  const handleMarkDelivered = async () => {
    try {
      // 1. Final status update
      await updateOrderStatus(order._id, 'delivered'); 
      
      // 2. Navigate to final collection/delivered screen
      navigation.navigate('CollectAmount', {
        orderId: order._id,
        totalAmount: (order.total_price || order.total).toFixed(2) || 0,
        paymentStatus: order.payment_method === 'COD' ? 'Pending Cash' : 'Paid', 
      });
      
    } catch (err) {
      Alert.alert('Error', 'Failed to finalize delivery status.');
    }
  };

  const handleCallCustomer = () => {
    const phone = order?.customer?.phone || order?.user?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Error', 'Customer phone not available.');
    }
  };

  if (loading || !order || !driverLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text>Loading destination details...</Text>
      </View>
    );
  }

  // Map Coordinates (Convert [lng, lat] to {lat, lng} for MapView)
  const customerCoords = order.address?.coordinates ? { longitude: order.address.coordinates[0], latitude: order.address.coordinates[1] } : null;

  // Mocked progress steps based on the flow being complete up to 'On the Way'
  const progressSteps = [
    { key: 'confirmed', icon: 'check-circle', title: 'Order Confirmed', subtitle: 'Order has been confirmed', time: '10:05', isComplete: true },
    { key: 'preparing', icon: 'restaurant-menu', title: 'Order Preparing', subtitle: 'Restaurant preparing food', time: '10:30', isComplete: true },
    { key: 'onTheWay', icon: 'local-shipping', title: 'On the Way', subtitle: 'You are at customer location', time: '10:35', isComplete: true },
  ];

  return (
    <View style={styles.fullContainer}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Header (Transparent over map) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.orderText}>Order #{order._id.slice(-5)}</Text>
          <TouchableOpacity>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* MAP SECTION */}
        {customerCoords && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: customerCoords.latitude,
                longitude: customerCoords.longitude,
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005,
              }}
            >
              <Marker coordinate={driverLocation} title="You">
                <Ionicons name="bicycle" size={30} color="#007AFF" />
              </Marker>
              <Marker coordinate={customerCoords} title={order.customer.name}>
                <Ionicons name="home" size={30} color="#FF6F00" />
              </Marker>
            </MapView>
        )}

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: order.user?.profile_pic ? `${API_BASE}${order.user.profile_pic}` : 'https://placehold.co/48x48/FF3B30/ffffff?text=P' }}
              style={styles.profileImage}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.customerName}>{order.user?.name || 'Customer'}</Text>
              <Text style={styles.customerLabel}>Customer</Text>
            </View>

            <TouchableOpacity style={styles.callBtn} onPress={handleCallCustomer}>
              <Ionicons name="call" size={18} color="#000" />
            </TouchableOpacity>

            <View style={styles.destinationTag}>
              <Text style={styles.destinationText}>At Destination</Text>
            </View>
          </View>

          {/* Status Steps */}
          <View style={styles.statusContainer}>
            {progressSteps.map((step) => (
              <StatusItem key={step.key} {...step} />
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* FINAL ACTION BUTTON - Fixed Bottom */}
      <TouchableOpacity style={styles.reachedButton} onPress={handleMarkDelivered}>
        <Text style={styles.reachedText}>
            {order.payment_method === 'COD' ? `Collect ₹${(order.total_price || order.total).toFixed(2)} / Mark Delivered` : 'Mark Delivered'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReachedDestinationScreen;

const styles = StyleSheet.create({
  // ... (All styles from previous response for ReachedDestinationScreen)
  fullContainer: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  map: { width: '100%', height: 300 },
  header: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  orderText: { fontSize: 16, fontWeight: 'bold' },
  helpText: { color: '#FF3B30', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 5,
  },
  profileImage: { width: 48, height: 48, borderRadius: 24 },
  customerName: { fontSize: 16, fontWeight: 'bold' },
  customerLabel: { fontSize: 13, color: 'gray' },
  callBtn: {
    marginLeft: 'auto',
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  destinationTag: { backgroundColor: '#D4F4EF', padding: 6, borderRadius: 10 },
  destinationText: { fontSize: 12, color: '#007B6E', fontWeight: 'bold' },
  statusContainer: { marginVertical: 10 },
  statusItem: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 },
  statusIcon: { marginRight: 12, marginTop: 2 },
  statusTitle: { fontWeight: 'bold', fontSize: 14 },
  statusSubtitle: { fontSize: 12, color: '#777' },
  statusTime: { fontSize: 12, color: '#999', marginLeft: 10, marginTop: 2 },
  reachedButton: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    marginHorizontal: '5%',
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  reachedText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});