// screens/OrderHistoryScreen.js
import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DeliveryContext } from '../Context/DeliveryContext';

// Helper function for status color
const getStatusColor = (status) => {
  const s = status.toLowerCase();
  if (s === 'delivered') return '#4CAF50';
  if (s === 'assigned' || s === 'picked') return '#00A86B';
  if (s === 'chef_accepted' || s === 'preparing') return '#FF9800';
  return '#f44336';
};

// Component to render each order
const OrderItem = ({ item }) => (
  <TouchableOpacity style={styles.orderItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.customerNameText}>{item.customerName}</Text>
      <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
      <Text style={styles.orderDate}>{item.createdDate}</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={styles.orderTotal}>₹{item.totalAmount.toFixed(2)}</Text>
      <Text style={[styles.orderStatus, { color: getStatusColor(item.statusText) }]}>
        {item.statusText}
      </Text>
    </View>
  </TouchableOpacity>
);

const OrderHistoryScreen = ({ navigation }) => {
  const { orderHistory, ongoingOrders, loadingOrders, fetchOrders } = useContext(DeliveryContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Combine ongoing + past orders for FlatList
  const combinedOrders = [...ongoingOrders, ...orderHistory];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Loader */}
      {loadingOrders ? (
        <ActivityIndicator size="large" color="#FF3B30" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={combinedOrders}
          renderItem={({ item }) => <OrderItem item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
              No orders found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  listContainer: { padding: 15 },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  customerNameText: { fontSize: 14, color: '#555', fontWeight: '500' },
  orderNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  orderDate: { fontSize: 13, color: '#888', marginTop: 2 },
  rightContainer: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 16, fontWeight: 'bold' },
  orderStatus: { fontSize: 13, marginTop: 4, fontWeight: '500' },
});

export default OrderHistoryScreen;
