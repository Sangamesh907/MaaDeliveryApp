import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrdersStack from '../navigation/OrdersStack';
import EarningsScreen from '../screens/EarningsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
  initialRouteName="Orders" // ✅ Set Orders as default
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#4CAF50',
    tabBarInactiveTintColor: 'gray',
    tabBarShowLabel: true,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      let iconSize = 24;

      if (route.name === 'Orders') {
        iconName = 'clipboard-list';
      } else if (route.name === 'Earnings') {
        iconName = 'rupee-sign';
      } else if (route.name === 'Profile') {
        iconName = 'user-circle';
      }

      return <FontAwesome5 name={iconName} size={iconSize} color={color} />;
    },
  })}
>
  <Tab.Screen name="Orders" component={OrdersStack} options={{ tabBarLabel: 'Orders' }} />
  <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarLabel: 'Earnings' }} />
  <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
</Tab.Navigator>

  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 90 : 60, // Adjust height to match the picture
    paddingVertical: 5,
    borderTopWidth: 1, // Add a slight border top to separate it from the content
    borderTopColor: '#e0e0e0',
    // The screenshot's bottom bar is not rounded, so we remove the radius.
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    
    // We also remove the position: 'absolute' since it's not needed by default
    // and can cause issues. It's better to let navigation container handle it.
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});