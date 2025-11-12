import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrdersStack from '../navigation/OrdersStack';
import EarningsScreen from '../screens/EarningsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, Platform } from 'react-native';
import { DeliveryContext } from '../Context/DeliveryContext';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { ongoingOrders } = useContext(DeliveryContext);

  return (
    <Tab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color }) => {
          let iconName;
          const iconSize = 24;

          if (route.name === 'Orders') iconName = 'clipboard-list';
          else if (route.name === 'Earnings') iconName = 'rupee-sign';
          else if (route.name === 'Profile') iconName = 'user-circle';

          return <FontAwesome5 name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarBadge: ongoingOrders.length > 0 ? ongoingOrders.length : null,
          tabBarBadgeStyle: {
            backgroundColor: '#ff3b30',
            color: '#fff',
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarLabel: 'Earnings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
