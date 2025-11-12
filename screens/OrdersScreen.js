// screens/OrdersScreen.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NewOrders from './NewOrders';
import OngoingOrders from './OngoingOrders';
import DeliveredOrders from './DeliveredOrders';
import { DeliveryContext } from '../Context/DeliveryContext';

const OrdersScreen = () => {
  const { acceptedOrderId } = useContext(DeliveryContext);
  const [activeTab, setActiveTab] = useState('New');

  // Switch to Ongoing automatically if an order is accepted
  useEffect(() => {
    if (acceptedOrderId) setActiveTab('Ongoing');
  }, [acceptedOrderId]);

  const renderContent = () => {
    if (activeTab === 'New') return <NewOrders />;
    if (activeTab === 'Ongoing') return <OngoingOrders />;
    if (activeTab === 'Delivered') return <DeliveredOrders />;
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['New', 'Ongoing', 'Delivered'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.activeText : styles.inactiveText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
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
