import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { DeliveryContext } from '../Context/DeliveryContext';

const chefPlaceholder = require('../assets/chef_profile.png'); // fallback image

// Map raw order to UI-friendly object
const mapOrderForUI = (order) => {
  const itemsArray = Array.isArray(order.items) ? order.items : [];
  return {
    id: order.id || order._id,
    items: itemsArray,
    itemsString: itemsArray.map(i => `${i.quantity}x ${i.food_name}`).join(', ') || 'N/A',
    amount: order.total_price || 0,
    earnings: Math.floor((order.total_price || 0) * 0.15),
    chefName: order.chef?.name || 'Chef Name',
    chefPhone: order.chef?.phone_number || 'N/A',
    chefLocation: order.chef?.location?.address || 'Unknown Location',
    distance: order.distance ? `${order.distance.toFixed(1)} km Away` : '?.? km Away',
    deliveryLocation: order.address?.area || 'Unknown Area',
    orderedOn: order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString(),
    chefImage: order.chef?.profile_pic ? `http://3.110.207.229${order.chef.profile_pic}` : null,
    rawOrder: order,
    status: order.status || 'pending',
  };
};

const NewOrders = ({ onOrderAccepted }) => {
  const navigation = useNavigation();
  const {
    orders: wsOrders,
    fetchOrders,
    token,
    logout,
    respondOrder,
  } = useContext(DeliveryContext);

  const [localOrders, setLocalOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstLoadRef = useRef(true);
  const alertedOrderIdsRef = useRef(new Set());

  // Sync WebSocket orders
  useEffect(() => {
    const mappedOrders = wsOrders.map(mapOrderForUI);

    if (!firstLoadRef.current) {
      const newOrders = mappedOrders.filter(
        wsOrder => !localOrders.some(local => local.id === wsOrder.id) &&
                   !alertedOrderIdsRef.current.has(wsOrder.id)
      );

      newOrders.forEach(order => {
        Alert.alert(
          '📦 New Order Received',
          `Order ID: ${order.id}\nItems: ${order.itemsString}\nAmount: ₹${order.amount}`,
          [
            { text: 'Reject', onPress: () => handleReject(order.id), style: 'destructive' },
            { text: 'Accept', onPress: () => handleAccept(order.id), style: 'default' },
          ]
        );
        alertedOrderIdsRef.current.add(order.id);
      });
    } else {
      firstLoadRef.current = false;
    }

    setLocalOrders(mappedOrders);
    setIsLoading(false);
  }, [wsOrders]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    if (!token) {
      Alert.alert('Authentication Error', 'Please log in again.');
      logout();
      setRefreshing(false);
      return;
    }
    try { await fetchOrders(); } catch (err) { console.warn('Refresh failed', err); }
    setRefreshing(false);
  };

  // Accept / Reject
  const handleAccept = (orderId) => {
    setLocalOrders(prev => prev.filter(o => o.id !== orderId));
    respondOrder(orderId, 'accept');
    if (typeof onOrderAccepted === 'function') onOrderAccepted();
  };

  const handleReject = (orderId) => {
    setLocalOrders(prev => prev.filter(o => o.id !== orderId));
    respondOrder(orderId, 'reject');
  };

  const handleCall = (phoneNumber) => {
    Alert.alert('Call', `Calling chef at ${phoneNumber}.`);
  };

  // Render single order card
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.chefInfoContainer}>
        <Image source={item.chefImage ? { uri: item.chefImage } : chefPlaceholder} style={styles.chefImage} />
        <View style={styles.chefDetails}>
          <Text style={styles.chefName}>{item.chefName}</Text>
          <Text style={styles.chefLocation}>
            {item.chefLocation} ({item.distance})
          </Text>
          <Text style={styles.deliveryLocation}>Delivery: {item.deliveryLocation}</Text>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.chefPhone)}>
          <Ionicons name="call" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.orderDetailsContainer}>
        <Text style={styles.detailLabel}>Items:</Text>
        <Text style={styles.detailValue}>{item.itemsString}</Text>

        <Text style={styles.detailLabel}>Ordered On:</Text>
        <Text style={styles.detailValue}>{item.orderedOn}</Text>

        <Text style={styles.detailLabel}>Your Earnings:</Text>
        <View style={styles.earningsRow}>
          <Feather name="trending-up" size={16} color="#D82A2A" />
          <Text style={styles.earningsValue}>₹ {item.earnings}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
          <Text style={styles.rejectButtonText}>Reject Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
          <Text style={styles.acceptButtonText}>Accept Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && localOrders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading New Orders...</Text>
      </View>
    );
  }

  if (localOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No New Orders Available</Text>
        <Text style={styles.emptySubText}>Check back soon for delivery opportunities.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={localOrders}
      renderItem={renderOrderItem}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

export default NewOrders;

// --- Styles ---
const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 20, backgroundColor: '#f8f8f8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#999', marginTop: 10 },
  emptySubText: { fontSize: 14, color: '#bbb', textAlign: 'center', marginTop: 5 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  chefInfoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chefImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  chefDetails: { flex: 1 },
  chefName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chefLocation: { fontSize: 13, color: '#777' },
  deliveryLocation: { fontSize: 13, color: '#555', marginTop: 2 },
  callButton: { padding: 6, borderRadius: 20, backgroundColor: '#e6f4ea' },
  orderDetailsContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  detailLabel: { fontSize: 14, color: '#555', fontWeight: 'bold', marginTop: 5 },
  detailValue: { fontSize: 14, color: '#333', marginTop: 2 },
  earningsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  earningsValue: { fontSize: 14, color: '#D82A2A', marginLeft: 5, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  acceptButton: { flex: 1, backgroundColor: '#4CAF50', paddingVertical: 10, borderRadius: 8, marginLeft: 5, alignItems: 'center' },
  acceptButtonText: { color: '#fff', fontWeight: 'bold' },
  rejectButton: { flex: 1, backgroundColor: '#F44336', paddingVertical: 10, borderRadius: 8, marginRight: 5, alignItems: 'center' },
  rejectButtonText: { color: '#fff', fontWeight: 'bold' },
});
