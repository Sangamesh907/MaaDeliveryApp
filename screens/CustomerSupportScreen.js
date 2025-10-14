import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const SupportOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Feather name={icon} size={24} color="#4CAF50" />
    <View style={styles.optionText}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={24} color="#ccc" />
  </TouchableOpacity>
);

const CustomerSupportScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Customer Support</Text>
      <View style={{ width: 24 }} />
    </View>
    <View style={styles.content}>
      <Text style={styles.infoText}>
        Have an issue? We're here to help. Choose one of the options below to get in touch with our team.
      </Text>
      <SupportOption
        icon="phone-call"
        title="Call Us"
        subtitle="Speak to a support agent"
        onPress={() => Alert.alert('Call Support', 'Our support number is 1-800-123-4567.')}
      />
      <SupportOption
        icon="mail"
        title="Email Us"
        subtitle="Get a response within 24 hours"
        onPress={() => Alert.alert('Email Support', 'Send your query to support@example.com.')}
      />
      <SupportOption
        icon="message-square"
        title="Live Chat"
        subtitle="Chat with us now"
        onPress={() => Alert.alert('Live Chat', 'Live chat feature is coming soon!')}
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  infoText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  optionText: { flex: 1, marginLeft: 20 },
  optionTitle: { fontSize: 16, fontWeight: '600' },
  optionSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
});

export default CustomerSupportScreen;