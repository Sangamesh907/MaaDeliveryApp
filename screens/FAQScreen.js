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

// Reusable component for section headers (e.g., "👩‍🍳 About Maakitchen")
const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

// Reusable component for each Question & Answer pair
const FAQItem = ({ question, answer }) => (
  <View style={styles.faqItem}>
    <Text style={styles.questionText}>{question}</Text>
    <Text style={styles.answerText}>{answer}</Text>
  </View>
);

const FAQScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SectionHeader title="👩‍🍳 About Maakitchen" />
        <FAQItem
          question="Q1. What is Maakitchen?"
          answer="A: Maakitchen is a platform that connects customers with local home chefs to deliver fresh, hygienic, and delicious homecooked meals right to your doorstep."
        />
        <FAQItem
          question="Q2. How is Maakitchen different from regular food delivery apps?"
          answer="A: Unlike restaurant-based platforms, Maakitchen offers food prepared by verified home chefs, ensuring authentic taste, personalized menus, and healthy options free from commercial additives."
        />

        <SectionHeader title="🛒 Ordering & Delivery" />
        <FAQItem
          question="Q3. How do I place an order on Maakitchen?"
          answer="A: You can place an order through our mobile app or website. Simply browse menus from nearby home chefs, add items to your cart, and choose your delivery time slot."
        />
        <FAQItem
          question="Q4. Can I pre-order meals in advance?"
          answer="A: Yes, pre-ordering is encouraged to give home chefs ample preparation time. You can schedule meals for the same day or upcoming days."
        />
        <FAQItem
          question="Q5. What is the delivery time for my order?"
          answer="A: Delivery usually takes between 30 minutes to 1.5 hours depending on the chef’s location and meal preparation time."
        />
        <FAQItem
          question="Q6. Are there delivery charges?"
          answer="A: Delivery charges vary by distance but are clearly shown at checkout. Some chefs offer free delivery for minimum order values."
        />

        <SectionHeader title="👨‍🍳 About the Home Chefs" />
        <FAQItem
          question="Q7. Who are the chefs on Maakitchen?"
          answer="A: Our chefs are passionate home cooks, homemakers, and culinary professionals who have been verified and trained in hygiene and quality standards."
        />
        <FAQItem
          question="Q8. Can I rate or review a chef?"
          answer="A: Yes, after your meal is delivered, you’ll be prompted to rate your experience and leave a review to help others."
        />
        <FAQItem
          question="Q9. Can I follow or favorite a chef?"
          answer="A: Absolutely! You can follow your favorite chefs to get notified when they upload new dishes or special menus."
        />

        <SectionHeader title="💳 Payments & Refunds" />
        <FAQItem
          question="Q10. What payment methods are accepted?"
          answer="A: We accept UPI, debit/credit cards, net banking, and wallet payments like Paytm, PhonePe, and Google Pay."
        />
        <FAQItem
          question="Q11. Is Cash on Delivery (COD) available?"
          answer="A: In select areas, yes. COD availability will be shown at checkout."
        />
        <FAQItem
          question="Q12. What if I receive the wrong or bad-quality food?"
          answer="A: We’re sorry to hear that! Please report the issue via the app or call our customer support. We will investigate and issue refunds or credits as appropriate."
        />
        
        <SectionHeader title="🧼 Hygiene & Safety" />
        <FAQItem
          question="Q13. How do you ensure food safety and hygiene?"
          answer="A: All chefs follow FSSAI guidelines. We conduct regular kitchen inspections, offer hygiene training, and collect customer feedback regularly."
        />
        <FAQItem
          question="Q14. Are chefs vaccinated and trained in hygiene practices?"
          answer="A: Yes, we prioritize onboarding chefs who are vaccinated and trained in hygienic food handling and kitchen sanitation."
        />

        <SectionHeader title="🔄 Subscriptions & Custom Meals" />
        <FAQItem
          question="Q15. Do you offer meal subscriptions?"
          answer="A: Yes! Daily, weekly, and monthly tiffin subscriptions are available from select chefs."
        />
        <FAQItem
          question="Q16. Can I customize my meal (less spicy, Jain, gluten-free, etc.)?"
          answer="A: Most chefs allow customizations. Just mention your preferences in the special instructions section while ordering."
        />

        <SectionHeader title="🌍 Locations & Availability" />
        <FAQItem
          question="Q17. Where is Maakitchen available?"
          answer="A: Maakitchen is currently available in select Indian cities. You can enter your PIN code on our website/app to check availability in your area."
        />
        <FAQItem
          question="Q18. Are there vegetarian or regional specialty options?"
          answer="A: Absolutely! You’ll find North Indian, South Indian, Jain, Bengali, Rajasthani, and many more homemade specialties."
        />

        <SectionHeader title="📞 Support & Feedback" />
        <FAQItem
          question="Q19. How can I contact Maakitchen?"
          answer="A: You can reach us via the app's support chat, email at support@maakitchen.in, or call our helpline at +91-XXXXXXXXXX."
        />
        <FAQItem
          question="Q20. How do I give feedback or suggest improvements?"
          answer="A: You can rate chefs, leave reviews, or use the in-app feedback form to share your thoughts. We love hearing from our users!"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light grey background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
});

export default FAQScreen;