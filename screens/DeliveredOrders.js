import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Placeholder image for the scooter illustration.
// You'll need to replace this with your actual image path.
const scooterIllustration = require('../assets/scooter_delivery.png'); 

const DeliveredOrders = () => {
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [feedback, setFeedback] = useState(''); // State to store customer feedback

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={30} color="#000" />
        </TouchableOpacity>

        {/* Scooter Illustration */}
        <Image source={scooterIllustration} style={styles.illustration} resizeMode="contain" />

        {/* Delivery Confirmation Message */}
        <Text style={styles.deliveryMessage}>Order has been Successfully Delivered</Text>

        {/* Rate the Customer Section */}
        <Text style={styles.rateCustomerTitle}>Rate the Customer</Text>
        <View style={styles.starRatingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
              <FontAwesome
                name={star <= rating ? 'star' : 'star-o'} // 'star' for filled, 'star-o' for outline
                size={40}
                color={star <= rating ? '#FFD700' : '#ccc'} // Gold for filled, grey for outline
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Input */}
        <TextInput
          style={styles.feedbackInput}
          placeholder="Write your experience"
          placeholderTextColor="#888"
          multiline={true}
          numberOfLines={4}
          value={feedback}
          onChangeText={setFeedback}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30, // Add some padding at the bottom
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1, // Ensure it's above other elements
    padding: 10, // Make it easier to tap
  },
  illustration: {
    width: '100%',
    height: 200,
    marginTop: 40, // Adjust margin to accommodate close button
    marginBottom: 30,
  },
  deliveryMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  rateCustomerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  feedbackInput: {
    width: '100%',
    minHeight: 100,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top', // For multiline input
    marginBottom: 30,
    color: '#000', // Ensure text is visible
  },
  submitButton: {
    backgroundColor: '#FF4747', // Red color from the screenshot
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveredOrders;