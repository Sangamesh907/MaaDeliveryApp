import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const AddBankAccount = ({ navigation }) => {
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');

  const handleSave = () => {
    if (!accountHolder || !accountNumber || !ifsc || !bankName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate API call or save logic
    Alert.alert('Success', 'Bank Account Added Successfully');
    navigation.goBack(); // go back to the previous screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Bank Account</Text>

      <Text style={styles.label}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={accountHolder}
        onChangeText={setAccountHolder}
        placeholder="Enter account holder name"
      />

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter account number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>IFSC Code</Text>
      <TextInput
        style={styles.input}
        value={ifsc}
        onChangeText={setIfsc}
        placeholder="Enter IFSC code"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Bank Name</Text>
      <TextInput
        style={styles.input}
        value={bankName}
        onChangeText={setBankName}
        placeholder="Enter bank name"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AddBankAccount;
