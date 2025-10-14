import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ReachedDestinationScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.orderText}>Order #23568</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Dummy Map Image */}
      <Image
        source={require('../assets/dummy_map.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Delivery Info */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.profileImage}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.customerName}>Prakash</Text>
            <Text style={styles.customerLabel}>Customer</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={18} color="#000" />
          </TouchableOpacity>
          <View style={styles.destinationTag}>
            <Text style={styles.destinationText}>At Destination</Text>
          </View>
        </View>

        {/* Status List */}
        <View style={styles.statusContainer}>
          <StatusItem
            icon="check-circle"
            title="Order Confirmed"
            subtitle="Order has been confirmed"
            time="10:05"
            iconColor="#00C851"
          />
          <StatusItem
            icon="restaurant-menu"
            title="Order Preparing"
            subtitle="We are Preparing Your Order"
            time="10:30"
            iconColor="#00C851"
          />
          <StatusItem
            icon="local-shipping"
            title="On the Way"
            subtitle="Your Tasty Food is on the way"
            time="10:35"
            iconColor="#00C851"
          />
        </View>

        <TouchableOpacity
        style={styles.reachedButton}
        onPress={() => navigation.navigate('CollectAmount')}
      >
        <Text style={styles.reachedText}>Reached Destination</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const StatusItem = ({ icon, title, subtitle, time, iconColor }) => (
  <View style={styles.statusItem}>
    <MaterialIcons name={icon} size={24} color={iconColor} style={styles.statusIcon} />
    <View style={{ flex: 1 }}>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.statusTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapImage: {
    width: '100%',
    height: 300,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: 'red',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerLabel: {
    fontSize: 13,
    color: 'gray',
  },
  callBtn: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  destinationTag: {
    backgroundColor: '#D4F4EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  destinationText: {
    fontSize: 12,
    color: '#007B6E',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginVertical: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  statusIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  statusTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  statusTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  reachedButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  reachedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReachedDestinationScreen;
