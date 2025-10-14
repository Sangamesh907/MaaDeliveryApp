import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params || {}; // ✅ safely handle missing params
  const [chefArea, setChefArea] = useState('Unknown');

  // Fetch chef area (reverse geocoding)
  useEffect(() => {
    if (order?.chef) fetchChefArea(order.chef);
  }, [order]);

  const fetchChefArea = async (chef) => {
    try {
      const coords = chef?.location?.coordinates;
      if (coords?.length === 2) {
        const [lng, lat] = coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const text = await res.text();

        try {
          const data = JSON.parse(text);
          const area =
            data.address?.suburb ||
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            'Unknown';
          setChefArea(area);
        } catch (err) {
          console.warn('⚠️ Non-JSON response from geocoding API:', text);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch chef area:', err);
    }
  };

  const handleCallCustomer = () => {
    const phone = order?.customer?.phone_number || order?.customer?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert('Phone number not available');
  };

  // Safely calculate totals
  const items = order?.items || [];
  const totalAmount = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );
  const promo = order?.promoDiscount || 0;
  const deliveryCharge = order?.deliveryCharge || 0;
  const tax = order?.tax || 0;
  const total = totalAmount - promo + deliveryCharge + tax;
  const savings = promo;

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Chef Info */}
        <View style={styles.chefCard}>
          <Image
            source={{
              uri: order?.chef?.profile_pic
                ? `http://3.110.207.229${order.chef.profile_pic}`
                : 'https://via.placeholder.com/50',
            }}
            style={styles.chefImage}
          />
          <View style={styles.chefDetails}>
            <Text style={styles.chefName}>{order?.chef?.name || 'Chef'}</Text>
            <Text style={styles.chefLocation}>{chefArea}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              order?.chef?.phone
                ? Linking.openURL(`tel:${order.chef.phone}`)
                : Alert.alert('Phone number not available')
            }
            style={styles.callButton}
          >
            <Ionicons name="call" size={24} color="#00A86B" />
          </TouchableOpacity>
        </View>

        {/* Order Info */}
        <View style={styles.infoCard}>
          <Text style={styles.statusText}>
            Order Status: {order?.status || 'In Process'}
          </Text>
          <Text style={styles.infoText}>
            Order Id : #{order?._id?.slice(-5) || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            Customer Name : {order?.customer?.name || 'Unknown'}
          </Text>
          <Text style={styles.infoText}>
            Delivery Location :{' '}
            {order?.customer?.location?.address || 'Address not available'}
          </Text>
          <TouchableOpacity onPress={handleCallCustomer} style={{ marginTop: 8 }}>
            <Text style={{ color: '#00A86B', fontWeight: '600' }}>
              Call Customer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <View style={styles.billCard}>
          <Text style={styles.sectionTitle}>Bill Amount</Text>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text>
                  {item.name} x{item.quantity || 1}
                </Text>
                <Text>₹{(item.price || 0) * (item.quantity || 1)}</Text>
              </View>
            ))
          ) : (
            <Text>No items found</Text>
          )}

          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>₹{totalAmount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Promo</Text>
            <Text>-₹{promo}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Charges</Text>
            <Text>₹{deliveryCharge}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tax</Text>
            <Text>₹{tax}</Text>
          </View>
          <View
            style={[styles.summaryRow, { marginTop: 5, borderTopWidth: 1, paddingTop: 5 }]}
          >
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
            <Text style={{ fontWeight: 'bold' }}>₹{total}</Text>
          </View>
          <Text style={styles.savingsText}>Your Total Savings ₹{savings}</Text>
        </View>
      </ScrollView>

      {/* Navigate Button */}
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => {
          if (!order?._id) {
            Alert.alert('Error', 'Order ID missing');
            return;
          }
          navigation.navigate('OrderTracking', { orderId: order._id });
        }}
      >
        <Text style={styles.navigateText}>Navigate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f6f6f6',
    margin: 16,
    borderRadius: 12,
  },
  chefImage: { width: 50, height: 50, borderRadius: 25 },
  chefDetails: { flex: 1, marginLeft: 12 },
  chefName: { fontWeight: 'bold', fontSize: 16 },
  chefLocation: { fontSize: 12, color: 'gray' },
  callButton: { padding: 6 },
  infoCard: {
    backgroundColor: '#f6f6f6',
    marginHorizontal: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  statusText: { color: '#00A86B', fontWeight: '600', marginBottom: 6 },
  infoText: { marginBottom: 4 },
  billCard: {
    backgroundColor: '#f6f6f6',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  savingsText: { color: 'green', marginTop: 5, fontWeight: '600' },
  navigateButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FF3B30',
    padding: 16,
    alignItems: 'center',
  },
  navigateText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
