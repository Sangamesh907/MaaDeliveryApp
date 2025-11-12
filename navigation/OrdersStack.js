// navigation/OrdersStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// --- CLEANED UP IMPORTS ---
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
// The main unified delivery screen
import DeliveryTrackingScreen from '../screens/DeliveryTrackingScreen'; 
// The dedicated final step screen
import ReachedDestinationScreen from '../screens/ReachedDestinationScreen'; 
// The screen after final confirmation
import CollectAmountScreen from '../screens/CollectAmountScreen';
// Other screens
import PaymentScreen from '../screens/PaymentScreen';
import InvoiceScreen from '../screens/InvoiceScreen';

// --- REMOVED OBSOLETE SCREENS: OrderStatusScreen, OrderPickupScreen

const Stack = createStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Primary Order Flow */}
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      
      {/* 🚚 PROFESSIONAL DELIVERY FLOW (Unified) 🚚 */}
      <Stack.Screen 
        name="DeliveryTracking" 
        component={DeliveryTrackingScreen} 
      />
      <Stack.Screen 
        name="ReachedDestination" 
        component={ReachedDestinationScreen} 
      />
      <Stack.Screen 
        name="CollectAmount" 
        component={CollectAmountScreen} 
      />

      {/* Other Screens */}
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
    </Stack.Navigator>
  );
};

export default OrdersStack;