import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PaymentScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.orderId}>Order #23568</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Bill Section */}
      <Text style={styles.sectionTitle}>Bill Amount</Text>
      <View style={styles.card}>
        <View style={styles.itemRow}>
          <Text>Dosa x 1</Text>
          <Text>₹60</Text>
        </View>
        <View style={styles.itemRow}>
          <Text>Idly x 1</Text>
          <Text>₹60</Text>
        </View>

        {/* Stamp */}
        <View style={styles.stampContainer}>
          <Text style={styles.stampText}>PAID</Text>
        </View>

        {/* Cost Details */}
        <View style={styles.itemRow}>
          <Text>Subtotal</Text>
          <Text>₹120</Text>
        </View>
        <View style={styles.itemRow}>
          <Text>Promo - (NEW50)</Text>
          <Text style={{ color: 'green' }}>-₹75</Text>
        </View>
        <View style={styles.itemRow}>
          <Text>Delivery Charges</Text>
          <Text>₹25</Text>
        </View>
        <View style={styles.itemRow}>
          <Text>Tax</Text>
          <Text>₹25</Text>
        </View>

        {/* Total */}
        <View style={[styles.itemRow, { borderTopWidth: 1, marginTop: 10, paddingTop: 10 }]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹120</Text>
        </View>

        {/* Savings */}
        <View style={[styles.itemRow, { justifyContent: 'flex-start' }]}>
          <Text style={styles.savingsText}>Your Total Savings</Text>
          <Text style={[styles.savingsText, { marginLeft: 10 }]}>₹75</Text>
        </View>
      </View>

      {/* Delivered Button */}
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fdfdff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: 'red',
    fontWeight: '600',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  stampContainer: {
    alignItems: 'center',
    marginVertical: 16,
    transform: [{ rotate: '-10deg' }],
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red',
    borderWidth: 3,
    borderColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 4,
    opacity: 0.2,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  savingsText: {
    color: 'green',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  deliveredButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 24,
  },
  deliveredButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentScreen;
