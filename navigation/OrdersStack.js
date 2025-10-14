// navigation/OrdersStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import OrderStatusScreen from '../screens/OrderStatusScreen'; 
import ReachedDestinationScreen from '../screens/ReachedDestinationScreen'; 
import OrderPickupScreen from '../screens/OrderPickupScreen';
import CollectAmountScreen from '../screens/CollectAmountScreen';
 // ✅ updated name





const Stack = createStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
      <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
     <Stack.Screen name="ReachedDestination" component={ReachedDestinationScreen} />
 <Stack.Screen name="OrderPickup" component={OrderPickupScreen} />
 <Stack.Screen name="CollectAmount" component={CollectAmountScreen} />

    </Stack.Navigator>
  );
};

export default OrdersStack;
