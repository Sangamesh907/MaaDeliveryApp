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

// Helper component for section headings
const SectionHeading = ({ number, title }) => (
  <Text style={styles.sectionHeading}>
    {number} {title}
  </Text>
);

// Helper component for list items (e.g., 1.1, 1.2)
const ListItem = ({ number, children }) => (
  <View style={styles.listItem}>
    <Text style={styles.listNumber}>{number}</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

// Helper component for sub-list items (e.g., (a), (b))
const SubListItem = ({ letter, children }) => (
  <View style={styles.subListItem}>
    <Text style={styles.listNumber}>{letter}</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.effectiveDate}>WITH EFFECT FROM [●]</Text>
        
        <Text style={styles.paragraph}>
          Welcome to [●] (the “Platform” or “Maakichen”). This Platform is owned and operated by [●], a company incorporated under the laws of India, having its registered office at [●] (the “Company/Maakichen” which expression would mean and include its officers, successors and permitted assigns or “us” or “we”). The Platform is for purposes of connecting home chefs and users who wish to avail services of online food delivery. A customer can choose and place orders ("Orders") from variety of products listed and offered for sale by various home chefs ("Merchant/s"), on the Platform and Maakichen enables delivery of such Orders at select localities of serviceable cities across India by using Your services as a delivery personnel ("Delivery Personnel"). The Platform enables You to register as a Delivery Personnel for enabling delivery of Orders to a Customer in return for a commission payable to You by the Company (“Services”).
        </Text>

        <SectionHeading number="1." title="APPLICABILITY AND AMENDMENT OF TERMS" />
        <ListItem number="1.1">
          These terms and conditions of use (“Terms”) apply to all registered members and users of the Platform who wish to register themselves as a Delivery Personnel (“Users”). We request you to carefully go through these before you decide to access this Platform or use the Services made available on the Platform. These Terms and the Privacy Policy together constitute a legal agreement (“Agreement”) between you and the Company in connection with your visit to the Platform and your use of the Services.
        </ListItem>
        <ListItem number="1.2">
          Your use of the Platform or the Services will signify your acceptance of the Terms and your agreement to be legally bound by the same. If you do not agree to or wish to be bound by these Terms and Privacy Policy, you may not access or otherwise use the Platform or the Services. We reserve the right to modify or terminate any portion of the Platform or the Services offered by the Company or amend the Terms for any reason, without notice and without liability to you or any third party. To make sure you are aware of any changes, please review these Terms periodically. Your continued use of the Platform or the Services will signify your acceptance of the amendments.
        </ListItem>
        <ListItem number="1.3">
          Nothing in the Terms should be construed to confer any rights to third party beneficiaries.
        </ListItem>

        <SectionHeading number="2." title="REGISTRATION AND ACCESS" />
        <ListItem number="2.1">
        If you wish to register as a Delivery Personnel, you will have to register on the Platform and become a registered user. To register onto the Platform, you will have to provide certain information such as your name, contact information, business profile, content details, among other information as may be required by the Company. Following this an exclusive username and password will be created for you. Please note that the Company shall register You as a Delivery Personnel only upon submission of your KYC documents and successful verification thereof by the Company. In the event that the Company finds your KYC documents unsatisfactory, the Company reserves the right to reject your registration as a Delivery Personnel at its sole discretion.
        </ListItem>
        <ListItem number="2.2">
        Registration is only a one time process and if you have been previously registered, you will login into your account using the same credentials as provided by you during the registration process. We request you to safeguard your password and your account and make sure that others do not have access to it. It is your responsibility to keep your account information current.
        </ListItem>
        {/* ...This pattern continues for all sections... */}
        
        <SectionHeading number="3." title="PLATFORM CONTENT"/>
        <ListItem number="3.1">
        All information provided by Users are self-declared and not verified by Maakichen.
        </ListItem>
        <ListItem number="3.2">
        As a User You expressly understand and agree that:
        </ListItem>
        <SubListItem letter="(a)">
        shall not use the Platform to host, display, upload, post, submit, distribute, modify, publish, transmit, update or share any Content that:
        </SubListItem>
        <SubListItem letter="(b)">
        belongs to another person and to which you do not have any right;
        </SubListItem>
        <SubListItem letter="(c)">
        is grossly harmful, harassing, blasphemous defamatory obscene, pornographic, pedophilic, libelous, invasive of another's privacy, hateful, or racially, ethnically objectionable, disparaging, relating or encouraging money laundering or gambling, or otherwise unlawful in any manner whatever;
        </SubListItem>
        {/* ...and so on for the rest of the text... */}

        <Text style={styles.finalAgreement}>
          YOU HAVE READ THESE TERMS & CONDITIONS AND AGREE TO ALL OF THE PROVISIONS CONTAINED ABOVE
        </Text>
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
    padding: 20,
  },
  effectiveDate: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 5,
  },
  subListItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 25,
  },
  listNumber: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#555',
    fontSize: 15,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    textAlign: 'justify',
  },
  finalAgreement: {
    marginTop: 30,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  }
});

export default TermsAndConditionsScreen;