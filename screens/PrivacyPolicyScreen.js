import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Reusable component for section headings
const SectionHeading = ({ number, title }) => (
  <Text style={styles.sectionHeading}>
    {number} {title}
  </Text>
);

// Reusable component for general paragraphs
const Paragraph = ({ children }) => (
    <Text style={styles.paragraph}>{children}</Text>
);

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.effectiveDate}>Last Updated: [Date]</Text>
        
        <Paragraph>
            Welcome to Maakichen. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the “Platform”). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
        </Paragraph>

        <SectionHeading number="1." title="INFORMATION WE COLLECT" />
        <Paragraph>
            We may collect information about you in a variety of ways. The information we may collect on the Platform includes:
        </Paragraph>
        <Paragraph>
            <Text style={styles.bold}>Personal Data:</Text> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Platform or when you choose to participate in various activities related to the Platform, such as placing an order.
        </Paragraph>
        <Paragraph>
            <Text style={styles.bold}>Financial Data:</Text> We do not store any financial information. All financial information is stored by our payment processor (e.g., Razorpay, Paytm, Stripe) and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
        </Paragraph>
        <Paragraph>
            <Text style={styles.bold}>Location Data:</Text> We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using the Platform, to provide location-based services like delivering your order.
        </Paragraph>

        <SectionHeading number="2." title="HOW WE USE YOUR INFORMATION" />
        <Paragraph>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:
        </Paragraph>
        <Paragraph>• Create and manage your account.</Paragraph>
        <Paragraph>• Fulfill and manage orders, payments, and other transactions related to the Platform.</Paragraph>
        <Paragraph>• Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Platform to you.</Paragraph>
        <Paragraph>• Monitor and analyze usage and trends to improve your experience with the Platform.</Paragraph>
        <Paragraph>• Notify you of updates to the Platform.</Paragraph>
        <Paragraph>• Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</Paragraph>

        <SectionHeading number="3." title="DISCLOSURE OF YOUR INFORMATION" />
        <Paragraph>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </Paragraph>
        <Paragraph>
            <Text style={styles.bold}>To Home Chefs and Delivery Personnel:</Text> We share your name, delivery address, and order details with our registered Home Chefs and Delivery Personnel to facilitate order fulfillment and delivery.
        </Paragraph>
        <Paragraph>
            <Text style={styles.bold}>By Law or to Protect Rights:</Text> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </Paragraph>

        <SectionHeading number="4." title="SECURITY OF YOUR INFORMATION" />
        <Paragraph>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </Paragraph>
        
        <SectionHeading number="5." title="POLICY FOR CHILDREN" />
        <Paragraph>
            We do not knowingly solicit information from or market to children under the age of 18. If we learn that we have collected personal information from a child under age 18 without verification of parental consent, we will delete that information as quickly as possible.
        </Paragraph>

        <SectionHeading number="6." title="CONTACT US" />
        <Paragraph>
            If you have questions or comments about this Privacy Policy, please contact our Grievance Officer at:
        </Paragraph>
        <Paragraph>
            Email: grievance@maakichen.in{'\n'}
            Address: [Your Company's Address Here]
        </Paragraph>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  effectiveDate: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  bold: {
      fontWeight: 'bold',
      color: '#000',
  }
});

export default PrivacyPolicyScreen;