import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

// --- Mock Data ---
const DATES_DATA = [
  { id: '1', day: 'Su', date: '08' },
  { id: '2', day: 'Mo', date: '09' },
  { id: '3', day: 'Tu', date: '10' },
  { id: '4', day: 'We', date: '11' },
  { id: '5', day: 'Th', date: '12' },
  { id: '6', day: 'Fr', date: '13' },
];

const TRANSACTIONS_DATA = [
  { id: 't1', amount: '60', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
  { id: 't2', amount: '115', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
  { id: 't3', amount: '95', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
  { id: 't4', amount: '80', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
  { id: 't5', amount: '90', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
  { id: 't6', amount: '2220', time: '09:10 PM', ref: '0259468582', fullDate: '9th February, 2019' },
];

// --- Reusable Date Item Component ---
const DateItem = ({ day, date, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.dateItem, isActive && styles.activeDateItem]}>
    <Text style={[styles.dateDay, isActive && styles.activeDateText]}>{day}</Text>
    <Text style={[styles.dateDate, isActive && styles.activeDateText]}>{date}</Text>
  </TouchableOpacity>
);

// --- Reusable Transaction Item Component ---
// *** CHANGE 1: Accept an onPress prop ***
const TransactionItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.transactionItem}
    onPress={onPress} // Use the passed onPress handler
  >
    <View style={styles.transactionContent}>
      <View style={styles.transactionIconContainer}>
        <FeatherIcon name="check" size={16} color="#FFFFFF" />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionAmount}>₹ {item.amount}</Text>
        <Text style={styles.transactionInfo}>
          {item.time}, Reference No. {item.ref}
        </Text>
      </View>
    </View>
    <FeatherIcon name="chevron-right" size={22} color="#C0C0C0" />
  </TouchableOpacity>
);

// --- Main Screen Component ---
// *** CHANGE 2: Accept the navigation prop ***
const TransactionsScreen = ({ navigation }) => {
  const [selectedDateId, setSelectedDateId] = useState('2');

  const handleGoBack = () => navigation.goBack();
  const handleDateNav = (direction) => Alert.alert('Navigate Dates', `Loading ${direction} dates...`);
  
  // *** CHANGE 3: Create a handler to navigate ***
  const handleTransactionPress = (transactionItem) => {
    // Navigate to the success screen and pass the tapped item's data
    navigation.navigate('BankTransfer', { transactionDetails: transactionItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* ... (rest of the card code is unchanged) ... */}
        <View style={styles.card}>
            <Text style={styles.monthText}>June, 2019</Text>
            <View style={styles.dateScroller}>
                <TouchableOpacity onPress={() => handleDateNav('previous')}>
                <FeatherIcon name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.datesContainer}>
                {DATES_DATA.map(item => (
                    <DateItem
                    key={item.id}
                    day={item.day}
                    date={item.date}
                    isActive={item.id === selectedDateId}
                    onPress={() => setSelectedDateId(item.id)}
                    />
                ))}
                </View>
                <TouchableOpacity onPress={() => handleDateNav('next')}>
                <FeatherIcon name="chevron-right" size={24} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountLabel}>Total Amount</Text>
                <Text style={styles.totalAmountValue}>₹ 2200</Text>
            </View>
        </View>

        {/* Bottom Card: Transaction List */}
        <View style={styles.transactionsCard}>
          <FlatList
            data={TRANSACTIONS_DATA}
            // *** CHANGE 4: Use the new handler in renderItem ***
            renderItem={({ item }) => (
                <TransactionItem item={item} onPress={() => handleTransactionPress(item)} />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginLeft: 16,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  datesContainer: {
    flexDirection: 'row',
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
    minWidth: 45,
  },
  activeDateItem: {
    backgroundColor: '#E0F2F1',
  },
  dateDay: {
    fontSize: 13,
    color: '#888',
  },
  dateDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  activeDateText: {
    color: '#00796B',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  totalAmountContainer: {
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginTop: 8,
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {},
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16 + 32 + 12,
  },
});

export default TransactionsScreen;