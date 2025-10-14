import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CollectAmountScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #23568</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} // Replace with actual image or use dynamic data
            style={styles.profileImage}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Prakash</Text>
            <Text style={styles.time}>9th February at 12:05am</Text>
          </View>
          <TouchableOpacity style={styles.callIcon}>
            <Ionicons name="call" size={22} color="#2ecc71" />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.status}>Order Status: <Text style={{ color: 'green' }}>In Process</Text></Text>
          <Text style={styles.detailText}>Order Id : #23568</Text>
          <Text style={styles.detailText}>Customer Name : Prakash</Text>
          <Text style={styles.detailText}>
            Delivery Location : Vishala Complex, 1st Floor, Sector 7, HSR Layout, Bangalore.
          </Text>
        </View>
      </View>

      {/* Bill Amount */}
      <Text style={styles.billTitle}>Bill Amount</Text>
      <View style={styles.card}>
        <View style={styles.billRow}>
          <Text>Dosa x 1</Text>
          <Text>₹ 60</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Idly x 1</Text>
          <Text>₹ 60</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.billRow}>
          <Text>Subtotal</Text>
          <Text>₹120</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Promo -(NEW50)</Text>
          <Text style={{ color: 'green' }}>-₹75</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Delivery Charges</Text>
          <Text>₹25</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Tax</Text>
          <Text>₹25</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.billRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹120</Text>
        </View>
        <Text style={styles.savings}>Your Total Savings <Text style={{ color: '#2ecc71' }}>₹75</Text></Text>
      </View>

      {/* Collect Amount Button */}
      <TouchableOpacity 
  style={styles.collectButton} 
  onPress={() => navigation.navigate('Payment')}
>
  <Text style={styles.collectText}>Collect Amount</Text>
</TouchableOpacity>

    </ScrollView>
  );
};

export default CollectAmountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: 'red',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginTop: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  customerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  callIcon: {
    backgroundColor: '#eafaf1',
    padding: 8,
    borderRadius: 20,
  },
  details: {
    marginTop: 16,
  },
  status: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    marginBottom: 2,
  },
  billTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 24,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  savings: {
    fontSize: 13,
    color: '#2ecc71',
    marginTop: 8,
    fontWeight: '600',
  },
  collectButton: {
    marginTop: 20,
    backgroundColor: '#ff3c3c',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  collectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
