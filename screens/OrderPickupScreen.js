import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DeliveryContext } from '../Context/DeliveryContext';

const InvoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;

  const { fetchOrderById } = useContext(DeliveryContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) loadOrder(orderId);
  }, [orderId]);

  const loadOrder = async (id) => {
    const data = await fetchOrderById(id);
    if (data) setOrder(data);
  };

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading order...</Text>
      </View>
    );
  }

  const customer = order.customer || {};
  const chef = order.chef || {};

  const handleCallCustomer = () => {
    if (customer.phone) Linking.openURL(`tel:${customer.phone}`);
  };

  const handleCallChef = () => {
    if (chef.phone) Linking.openURL(`tel:${chef.phone}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.orderText}>Order #{order._id}</Text>
        <Text style={styles.helpText}>Help</Text>
      </View>

      {/* Chef Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: chef.profile_pic ? `http://3.110.207.229${chef.profile_pic}` : 'https://via.placeholder.com/50' }}
            style={styles.profilePic}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.chefName}>{chef.name || 'Chef'}</Text>
            <Text style={styles.role}>{chef.location?.address || 'Area Unknown'}</Text>
          </View>
          <TouchableOpacity onPress={handleCallChef}>
            <Ionicons name="call" size={24} color="green" />
          </TouchableOpacity>
        </View>

        <Text style={styles.statusText}>
          Order Status: <Text style={{ color: 'green' }}>{order.status || 'Pending'}</Text>
        </Text>
        <Text style={styles.infoText}>Order Id : #{order._id}</Text>
        <Text style={styles.infoText}>Customer Name : {customer.name}</Text>
        <Text style={styles.infoText}>
          Delivery Location : {customer.location?.address || 'Unknown'}
        </Text>
      </View>

      {/* Bill Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bill Amount</Text>
        {order.items?.map((item, idx) => (
          <View key={idx} style={styles.billRow}>
            <Text>{item.name} x {item.quantity}</Text>
            <Text>₹ {item.price * item.quantity}</Text>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.billRow}><Text>Subtotal</Text><Text>₹{order.subtotal || 0}</Text></View>
        {order.promo && <View style={styles.billRow}><Text>Promo - ({order.promo.code})</Text><Text>-₹{order.promo.discount}</Text></View>}
        <View style={styles.billRow}><Text>Delivery Charges</Text><Text>₹{order.deliveryCharges || 0}</Text></View>
        <View style={styles.billRow}><Text>Tax</Text><Text>₹{order.tax || 0}</Text></View>
        <View style={styles.divider} />

        <View style={styles.billRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total || 0}</Text>
        </View>
        <Text style={styles.savingsText}>Your Total Savings ₹{order.promo?.discount || 0}</Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigation.navigate('OrderPickup', { orderId: order._id })}
      >
        <Ionicons name="navigate" size={20} color="#fff" />
        <Text style={styles.navigateButtonText}> Navigate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: { fontSize: 16, fontWeight: 'bold' },
  helpText: { color: 'red' },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  profileInfo: { marginLeft: 10, flex: 1 },
  chefName: { fontSize: 16, fontWeight: 'bold' },
  role: { color: 'gray' },
  statusText: { marginTop: 10, fontSize: 14 },
  infoText: { marginTop: 5, fontSize: 14, color: '#555' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 8,
  },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 16 },
  savingsText: { color: 'green', marginTop: 5 },
  navigateButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoiceScreen;
