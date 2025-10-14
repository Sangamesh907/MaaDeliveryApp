import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { DeliveryContext } from '../Context/DeliveryContext';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { updateOrderStatus, startLocationTracking, stopLocationTracking } = useContext(DeliveryContext);
  const [activeOrder, setActiveOrder] = useState(null);
  const [region, setRegion] = useState(null);

  // Fetch order details from backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://3.110.207.229/api/deliveryordertrack/${orderId}`);
        const data = await res.json();
        if (data.status === 'success') {
          setActiveOrder(data.order);
          if (data.order.chef?.location?.coordinates) {
            const [lng, lat] = data.order.chef.location.coordinates;
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }
        } else {
          Alert.alert('Error', 'Order not found');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to fetch order');
      }
    };
    fetchOrder();
  }, [orderId]);

  // Start location tracking on mount
  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, []);

  // Automatically detect when delivery reaches chef/customer
  useEffect(() => {
    if (!activeOrder) return;

    const chefLat = activeOrder.chef.location.coordinates[1];
    const chefLon = activeOrder.chef.location.coordinates[0];
    const customerLat = activeOrder.address.coordinates[1];
    const customerLon = activeOrder.address.coordinates[0];

    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Distance to chef
        const distanceToChef = getDistance(
          { latitude, longitude },
          { latitude: chefLat, longitude: chefLon }
        );

        if (distanceToChef <= 50 && !activeOrder.reachedChef) {
          Alert.alert('Status', 'You have reached the chef location');
          updateOrderStatus(activeOrder._id, 'reachedChef');
          setActiveOrder({ ...activeOrder, reachedChef: true });
        }

        // Distance to customer
        const distanceToCustomer = getDistance(
          { latitude, longitude },
          { latitude: customerLat, longitude: customerLon }
        );

        if (distanceToCustomer <= 50 && activeOrder.reachedChef && !activeOrder.delivered) {
          Alert.alert('Status', 'You have reached the customer location');
          updateOrderStatus(activeOrder._id, 'delivered');
          setActiveOrder({ ...activeOrder, delivered: true });
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <View style={styles.center}>
        <Text>Loading Order...</Text>
      </View>
    );
  }

  const openGoogleMaps = (lat, lon) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open maps'));
  };

  const statuses = [
    { title: 'Order Confirmed', icon: 'checkmark-circle', color: '#2ecc71', time: activeOrder.confirmedAt },
    { title: 'Order Preparing', icon: 'restaurant', color: '#f39c12', time: activeOrder.preparingAt },
    { title: 'Reached Chef', icon: 'bicycle', color: '#3498db', time: activeOrder.reachedChefAt },
    { title: 'Delivered', icon: 'checkmark-done', color: '#27ae60', time: activeOrder.deliveredAt },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.orderText}>Order #{activeOrder._id.slice(-6)}</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {activeOrder.chef?.location && (
            <Marker
              coordinate={{
                latitude: activeOrder.chef.location.coordinates[1],
                longitude: activeOrder.chef.location.coordinates[0],
              }}
              title="Chef Location"
              pinColor="green"
            />
          )}

          {activeOrder.address?.coordinates && (
            <Marker
              coordinate={{
                latitude: activeOrder.address.coordinates[1],
                longitude: activeOrder.address.coordinates[0],
              }}
              title="Customer Location"
              pinColor="red"
            />
          )}
        </MapView>
      )}

      {/* Status List */}
      <View style={styles.statusContainer}>
        {statuses.map((item, idx) => (
          <View style={styles.statusRow} key={idx}>
            <Ionicons name={item.icon} size={22} color={item.color} />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{item.title}</Text>
              <Text style={styles.statusDesc}>{item.time ? new Date(item.time).toLocaleTimeString() : 'Pending'}</Text>
            </View>
          </View>
        ))}

        {/* Navigate to Chef */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() =>
            openGoogleMaps(
              activeOrder.chef.location.coordinates[1],
              activeOrder.chef.location.coordinates[0]
            )
          }
        >
          <Text style={styles.buttonText}>Navigate to Chef</Text>
        </TouchableOpacity>

        {/* Navigate to Customer */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f44336' }]}
          onPress={() =>
            openGoogleMaps(
              activeOrder.address.coordinates[1],
              activeOrder.address.coordinates[0]
            )
          }
        >
          <Text style={styles.buttonText}>Navigate to Customer</Text>
        </TouchableOpacity>

        {/* ✅ Manual Action Buttons */}
        {!activeOrder.reachedChef && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#3498db' }]}
            onPress={() => {
              updateOrderStatus(activeOrder._id, 'reachedChef');
              setActiveOrder({ ...activeOrder, reachedChef: true });
              Alert.alert('Success', 'Marked as Reached Chef');
            }}
          >
            <Text style={styles.buttonText}>Mark Reached Chef</Text>
          </TouchableOpacity>
        )}

        {activeOrder.reachedChef && !activeOrder.delivered && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#27ae60' }]}
            onPress={() => {
              updateOrderStatus(activeOrder._id, 'delivered');
              setActiveOrder({ ...activeOrder, delivered: true });
              Alert.alert('Success', 'Marked as Delivered');
            }}
          >
            <Text style={styles.buttonText}>Mark Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    marginTop: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: { fontSize: 16, fontWeight: 'bold' },
  helpText: { color: 'red', fontWeight: 'bold' },
  map: { height: '55%', width: '100%' },
  statusContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
    elevation: 10,
    flex: 1,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statusText: { flex: 1, marginHorizontal: 10 },
  statusTitle: { fontWeight: 'bold', fontSize: 14 },
  statusDesc: { fontSize: 12, color: 'gray' },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
