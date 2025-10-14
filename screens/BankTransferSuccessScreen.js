import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native'; // *** CHANGE 1: Import useRoute

const BankTransferSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // *** CHANGE 2: Get the route object

  // *** CHANGE 3: Extract the passed data. Provide default values to prevent errors.
  const { transactionDetails } = route.params || {};
  const amount = transactionDetails?.amount || 'N/A';
  const refNo = transactionDetails?.ref || 'N/A';
  const fullDate = transactionDetails?.fullDate || 'N/A';
  const time = transactionDetails?.time || 'N/A';

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.successText}>Bank Transfer Successful</Text>
        {/* *** CHANGE 4: Use the dynamic data *** */}
        <Text style={styles.amountText}>₹ {amount}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.transferredToText}>Transferred to</Text>

        <View style={styles.bankDetails}>
            <Image
                source={require('../assets/icici_logo.png')} // This can also be passed dynamically
                style={styles.logo}
            />
          <View style={styles.bankTextContainer}>
            <Text style={styles.bankName}>ICICI Bank</Text>
            <Text style={styles.bankInfo}>IFSC Code: ICIC0023</Text>
            <Text style={styles.bankInfo}>Account No: 04xxxxxx235</Text>
          </View>
        </View>

        <View style={styles.referenceContainer}>
            {/* *** CHANGE 5: Use the dynamic data *** */}
          <Text style={styles.refText}>Reference No. <Text style={styles.bold}>{refNo}</Text></Text>
          <Text style={styles.dateText}>{fullDate} • {time}</Text>
        </View>
      </View>
    </View>
  );
};

export default BankTransferSuccessScreen;

// Styles are slightly adjusted for the new logo name
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f44336',
    height: 240,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  successText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: -30,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  transferredToText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    fontWeight: '500',
  },
  bankDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { // Changed from bankLogo to logo to match your JSX
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  bankTextContainer: {
    marginLeft: 12,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  bankInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  referenceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  refText: {
    fontSize: 14,
    color: '#444',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  bold: {
    fontWeight: '600',
  },
});