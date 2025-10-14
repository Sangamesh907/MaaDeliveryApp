import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrashIcon from 'react-native-vector-icons/Feather';

const INITIAL_ACCOUNTS = [
  { id: '1', bankName: 'ICICI Bank', ifsc: 'ICIC0023', accountNo: '04xxxxxxx235' },
  { id: '2', bankName: 'ICICI Bank', ifsc: 'ICIC0023', accountNo: '04xxxxxxx235' },
  { id: '3', bankName: 'ICICI Bank', ifsc: 'ICIC0023', accountNo: '04xxxxxxx235' },
];

// --- Reusable Bank Account Card Component ---
// This component now takes an `onSelect` prop
const BankAccountCard = ({ item, onSelect, onDelete }) => (
  <TouchableOpacity onPress={onSelect} style={styles.card}>
    <View style={styles.cardContent}>
      <Image
        source={require('../assets/icici_logo.png')} // Make sure you have this asset
        style={styles.logo}
      />
      <View style={styles.accountDetails}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text style={styles.accountInfo}>IFSC Code : {item.ifsc}</Text>
        <Text style={styles.accountInfo}>Account No : {item.accountNo}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.deleteContainer} onPress={onDelete}>
      <TrashIcon name="trash-2" size={22} color="#00A9A9" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

// --- Main Screen Component ---
// *** CHANGE 1: Accept the navigation prop ***
const BankAccountScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);

  // --- Handlers ---
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleAddAccount = () => {
    navigation.navigate('AddBankAccount');
  };

  const handleDeleteAccount = (id, bankName) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete this ${bankName} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setAccounts(currentAccounts =>
              currentAccounts.filter(account => account.id !== id)
            );
          },
          style: 'destructive',
        },
      ]
    );
  };

  // *** CHANGE 2: Handler for selecting an account to trigger the transfer ***
  const handleSelectAccount = (account) => {
    // In a real app, you would:
    // 1. Show a loading indicator.
    // 2. Make an API call to the backend to process the transfer.
    // 3. On success from the API, navigate to the success screen.
    // 4. On failure, show an error message.

    // For now, we'll simulate success and navigate directly.
    Alert.alert(
      "Confirm Transfer",
      `Transfer funds to ${account.bankName} (...${account.accountNo.slice(-4)})?`,
      [
          { text: 'Cancel', style: 'cancel'},
          { 
              text: 'Confirm', 
              onPress: () => navigation.navigate('BankTransfer') // Navigate to your success screen
          }
      ]
    )
  };

  const renderAccount = ({ item }) => (
    // *** CHANGE 3: Pass the handlers to the card component ***
    <BankAccountCard
      item={item}
      onSelect={() => handleSelectAccount(item)}
      onDelete={() => handleDeleteAccount(item.id, item.bankName)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Account</Text>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
          <Text style={styles.addButtonText}>Add Bank Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light grey background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  accountInfo: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  deleteContainer: {
    alignItems: 'center',
    paddingLeft: 10,
  },
  deleteText: {
    color: '#00A9A9',
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  addButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BankAccountScreen;