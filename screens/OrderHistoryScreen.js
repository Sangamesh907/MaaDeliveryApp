// screens/OrderHistoryScreen.js
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DeliveryContext } from '../Context/DeliveryContext';

const OrderItem = ({ item }) => {
  // adjust colors based on backend status
  const statusColor = item.status === 'Delivered' ? '#4CAF50' : '#f44336';
  return (
    <View style={styles.orderItem}>
      <View>
        <Text style={styles.orderNumber}>Order #{item.order_number || item.id}</Text>
        <Text style={styles.orderDate}>{item.date || new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.orderTotal}>₹{item.total || item.amount || '0.00'}</Text>
        <Text style={[styles.orderStatus, { color: statusColor }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
};

const OrderHistoryScreen = ({ navigation }) => {
  const { orders, fetchOrders, loadingOrders } = useContext(DeliveryContext);

  useEffect(() => {
    fetchOrders(); // fetch orders when screen mounts
  }, []);

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
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem item={item} />}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
              No orders found
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
    borderBottomColor: '#eee'
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
    elevation: 2
  },
  orderNumber: { fontSize: 16, fontWeight: 'bold' },
  orderDate: { fontSize: 13, color: '#888', marginTop: 4 },
  rightContainer: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 16, fontWeight: 'bold' },
  orderStatus: { fontSize: 13, marginTop: 4, fontWeight: '500' },
});

export default OrderHistoryScreen;
