import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DeliveryContext } from '../Context/DeliveryContext';

const OrderStatusScreen = ({ navigation }) => {
  const { activeOrder, updateOrderStatus } = useContext(DeliveryContext);

  if (!activeOrder) return <View style={styles.center}><Text>No Active Order</Text></View>;

  // --- Status Flow ---
  const statusFlow = [
    { status: 'assigned', label: 'Arrived at Restaurant' },
    { status: 'arrived', label: 'Picked Up' },
    { status: 'pickedup', label: 'On the Way' },
    { status: 'onTheWay', label: 'Arrived at Customer' },
    { status: 'delivered', label: 'Delivered' },
  ];

  // --- Determine next step ---
  const currentIndex = statusFlow.findIndex(s => s.status === activeOrder.status);
  const nextStep = statusFlow[currentIndex + 1];

  // --- Timeline for display ---
  const timeline = statusFlow.map(s => ({
    ...s,
    time: activeOrder[`${s.status}At`], // expects activeOrder.assignedAt, arrivedAt, etc.
  }));

  const handleStatusUpdate = async () => {
    if (!updateOrderStatus || !nextStep) return;
    await updateOrderStatus(activeOrder.id, nextStep.status);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.orderTitle}>Order #{activeOrder.id}</Text>
        <TouchableOpacity><Text style={styles.helpText}>Help</Text></TouchableOpacity>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}><Text>Map View Placeholder</Text></View>
      </View>

      {/* Timeline */}
      <View style={styles.statusList}>
        {timeline.map((item, idx) => (
          <View style={styles.statusItem} key={idx}>
            <Ionicons
              name={item.time ? 'checkmark-circle' : 'ellipse'}
              size={22}
              color={item.time ? '#00C853' : '#ccc'}
            />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>{item.label}</Text>
              <Text style={styles.statusDesc}>{item.time ? new Date(item.time).toLocaleTimeString() : 'Pending'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      {nextStep && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStatusUpdate}
        >
          <Text style={styles.ctaText}>{nextStep.label}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTitle: { fontSize: 16, fontWeight: '600' },
  helpText: { color: '#f44336', fontWeight: '500' },
  mapContainer: { marginHorizontal: 16, marginVertical: 10, borderRadius: 10, overflow: 'hidden' },
  mapPlaceholder: { height: 300, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  statusList: { marginHorizontal: 16, marginVertical: 12 },
  statusItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statusContent: { flex: 1, marginLeft: 12 },
  statusTitle: { fontWeight: 'bold', fontSize: 14 },
  statusDesc: { fontSize: 12, color: '#757575' },
  ctaButton: { margin: 16, backgroundColor: '#f44336', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
