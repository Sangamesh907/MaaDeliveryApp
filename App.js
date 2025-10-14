// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DeliveryProvider } from './Context/DeliveryContext';
import { navigationRef } from './RootNavigation';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MainTabs from './screens/MainTabs';
import BankTransferSuccessScreen from './screens/BankTransferSuccessScreen';
import BankAccountScreen from './screens/BankAccountScreen';
import AddBankAccountScreen from './screens/AddBankAccountScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import FAQScreen from './screens/FAQScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    console.log('🚀 App Mounted');
    return () => console.log('🛑 App Unmounted');
  }, []);

  return (
    <DeliveryProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => console.log('✅ Navigation Ready')}
        onStateChange={(state) => console.log('🌐 Navigation State Changed:', state?.routes?.map(r => r.name))}
      >
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/* Splash/Login/Otp */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />

          {/* MainTabs */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Bank & Transactions */}
          <Stack.Screen name="BankTransfer" component={BankTransferSuccessScreen} />
          <Stack.Screen name="BankAccount" component={BankAccountScreen} /> 
          <Stack.Screen name="AddBankAccount" component={AddBankAccountScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />

          {/* Order History & Support */}
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DeliveryProvider>
  );
};

export default App;
