// screens/OrdersScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NewOrders from './NewOrders';
import OngoingOrders from './OngoingOrders';
import DeliveredOrders from './DeliveredOrders';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('New');

  const renderContent = () => {
    if (activeTab === 'New') return <NewOrders onOrderAccepted={() => setActiveTab('Ongoing')} />;
    if (activeTab === 'Ongoing') return <OngoingOrders />;
    if (activeTab === 'Delivered') return <DeliveredOrders />;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabContainer}>
        {['New', 'Ongoing', 'Delivered'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={activeTab === tab ? styles.activeText : styles.inactiveText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#333',
  },
});

export default OrdersScreen;
