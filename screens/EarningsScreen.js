import React, { useState } from 'react'; // Import useState
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sample data for the days
const initialDays = [
  { id: '1', day: 'Su', date: '08' },
  { id: '2', day: 'Mo', date: '09' },
  { id: '3', day: 'Tu', date: '10' },
  { id: '4', day: 'We', date: '11' },
  { id: '5', day: 'Th', date: '12' },
  { id: '6', day: 'Fr', date: '13' },
  { id: '7', day: 'Sa', date: '14' },
];

// Sample data for transactions
const transactions = [
  { id: '1', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
  { id: '2', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
  { id: '3', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
  { id: '4', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
  { id: '5', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
  { id: '6', orderId: '23568', status: 'Completed', date: '9th, February, 2019', amount: '120' },
];

// ****** THE FIX IS HERE ******
// The component now accepts the `navigation` prop
const EarningsScreen = ({ navigation }) => {
  const [selectedDayId, setSelectedDayId] = useState('2'); // State to track selected day

  // Renders each day in the calendar
  const renderDayItem = ({ item }) => {
    const isSelected = item.id === selectedDayId;
    return (
      <TouchableOpacity 
        style={[styles.dayItem, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDayId(item.id)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{item.day}</Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDayText]}>{item.date}</Text>
      </TouchableOpacity>
    );
  };
  
  // Renders each transaction item
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.orderIdText}>Order Id : # {item.orderId}</Text>
        <Text style={styles.orderStatusText}>Order Status : {item.status}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>₹ {item.amount}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Level Header (Optional, if not part of a stack with a header) */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Earnings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Date Header Section */}
        <View style={styles.dateHeader}>
          <TouchableOpacity style={styles.arrowButton} onPress={() => Alert.alert("Navigate", "Previous month")}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.dateHeaderTitle}>June, 2019</Text>
          <TouchableOpacity style={styles.arrowButton} onPress={() => Alert.alert("Navigate", "Next month")}>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Date Calendar (Horizontal) */}
        <View>
          <FlatList
            horizontal
            data={initialDays}
            renderItem={renderDayItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayList}
          />
        </View>

        {/* Total Amount Card */}
        <View style={styles.totalAmountCard}>
          <View>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <View style={styles.amountRow}>
              <FontAwesome5 name="rupee-sign" size={24} color="#D82A2A" />
              <Text style={styles.totalAmountText}> 2200</Text>
            </View>
          </View>
           <TouchableOpacity
            style={styles.transferButton}
            onPress={() => navigation.navigate('BankAccount')}
          >
            <Text style={styles.transferButtonText}>Transfer to Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            scrollEnabled={false} // List is inside a ScrollView, so disable its own scrolling
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    topHeaderTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    dateHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    arrowButton: {
      padding: 10,
    },
    dateHeaderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    dayList: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#fff',
    },
    dayItem: {
      alignItems: 'center',
      marginHorizontal: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
    },
    selectedDay: {
      backgroundColor: '#4CAF50',
    },
    dayText: {
      fontSize: 14,
      color: '#888',
    },
    dateText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 2,
    },
    selectedDayText: {
      color: '#fff',
    },
    totalAmountCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
      marginHorizontal: 10,
      marginVertical: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    totalAmountLabel: {
      fontSize: 14,
      color: '#888',
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: 5,
    },
    totalAmountText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#D82A2A',
      marginLeft: 5,
    },
    transferButton: {
      backgroundColor: '#D82A2A',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      elevation: 2,
    },
    transferButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    transactionsContainer: {
      marginHorizontal: 10,
      marginBottom: 20,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    transactionLeft: {
      flex: 1,
    },
    transactionRight: {
      alignItems: 'flex-end',
    },
    orderIdText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    orderStatusText: {
      fontSize: 14,
      color: '#4CAF50',
      marginTop: 4,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    transactionDate: {
      fontSize: 12,
      color: '#888',
      marginTop: 4,
    },
});

export default EarningsScreen;