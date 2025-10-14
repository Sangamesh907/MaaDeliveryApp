import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InvoiceScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.orderText}>Order #23568</Text>
        <Text style={styles.helpText}>Help</Text>
      </View>

      {/* Chef Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={require('../assets/chef_profile.png')}
            style={styles.profilePic}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.chefName}>Lakshmi - Chef</Text>
            <Text style={styles.role}>HSR Layout</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="green" />
          </TouchableOpacity>
        </View>

        <Text style={styles.statusText}>Order Status: <Text style={{ color: 'green' }}>In Process</Text></Text>
        <Text style={styles.infoText}>Order Id : #23568</Text>
        <Text style={styles.infoText}>Customer Name : Prakash</Text>
        <Text style={styles.infoText}>
          Delivery Location : Vishala Complex, 1st Floor, Sector 7, HSR Layout, Bangalore.
        </Text>
      </View>

      {/* Bill Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bill Amount</Text>
        <View style={styles.billRow}><Text>Dosa x 1</Text><Text>₹ 60</Text></View>
        <View style={styles.billRow}><Text>Idly x 1</Text><Text>₹ 60</Text></View>

        <View style={styles.divider} />
        <View style={styles.billRow}><Text>Subtotal</Text><Text>₹120</Text></View>
        <View style={styles.billRow}><Text>Promo - (NEW50)</Text><Text>-₹75</Text></View>
        <View style={styles.billRow}><Text>Delivery Charges</Text><Text>₹25</Text></View>
        <View style={styles.billRow}><Text>Tax</Text><Text>₹25</Text></View>
        <View style={styles.divider} />

        <View style={styles.billRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>₹120</Text></View>
        <Text style={styles.savingsText}>Your Total Savings ₹75</Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.navigateButton}
       onPress={() => navigation.navigate('OrderPickup')}

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
