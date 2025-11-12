import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Linking,
    ActivityIndicator,
    Platform, // Import Platform for OS detection
    AppState, // Import AppState for background detection
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DeliveryContext } from '../Context/DeliveryContext';

const API_BASE = 'http://3.110.207.229'; // Base URL for image fetching

// Placeholder for external geocoding logic
const fetchChefArea = async (chef) => {
    return chef?.location?.area || 'Restaurant Location';
};

const OrderDetailsScreen = ({ route, navigation }) => {
    const { ongoingOrders, fetchOrders } = useContext(DeliveryContext);
    const { order: routeOrder, orderId } = route.params || {};

    const [order, setOrder] = useState(routeOrder || null);
    const [chefArea, setChefArea] = useState(null);

    // --- NEW STATE & REFS for AppState Listener ---
    const appState = useRef(AppState.currentState);
    // Flag to indicate that we launched maps and should navigate when app returns
    const [shouldNavigateOnFocus, setShouldNavigateOnFocus] = useState(false); 

    // Load order if not provided or if context updates
    useEffect(() => {
        let currentOrder = routeOrder;
        if (!currentOrder && orderId && ongoingOrders.length) {
            currentOrder = ongoingOrders.find(o => o._id === orderId);
        }
        setOrder(currentOrder);
    }, [orderId, ongoingOrders, routeOrder]);

    // Fetch chef location when order changes
    useEffect(() => {
        if (order?.chef) {
            fetchChefArea(order.chef).then(area => setChefArea(area));
        }
        // Refresh the list when entering this screen to get the latest status
        fetchOrders(); 
    }, [order]);

    // --- NEW LOGIC: AppState Listener to handle return from external map ---
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                shouldNavigateOnFocus &&
                order // Ensure order data is available
            ) {
                // App has returned to the foreground after launching maps
                setShouldNavigateOnFocus(false); // Reset the flag
                
                // Safely navigate to the tracking screen
                navigation.navigate('DeliveryTracking', { 
                    orderId: order._id, 
                    orderData: order,
                });
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [shouldNavigateOnFocus, order, navigation]);


    const handleCall = (phone) => {
        if (phone) Linking.openURL(`tel:${phone}`);
        else Alert.alert('Error', 'Phone number not available');
    };

    /** * NEW FUNCTION: Launches Google Maps/Apple Maps to the Chef's Location
     * Sets a flag to navigate to DeliveryTracking when the app returns.
     */
    const navigateToChef = (coords, label) => {
        if (!coords || coords.length !== 2) {
            return Alert.alert('Error', `Chef location not available.`);
        }

        // Coordinates from backend are [longitude, latitude]
        const [lng, lat] = coords;
        const cleanLabel = encodeURIComponent(label || 'Restaurant');

        let url;
        if (Platform.OS === 'ios') {
            // Apple Maps URL: Uses daddr for directions to coordinates
            url = `http://maps.apple.com/?daddr=${lat},${lng}&q=${cleanLabel}`;
        } else {
            // Google Maps/Android Intent: Uses geo: for location and 'q' for query/label
            url = `geo:${lat},${lng}?q=${lat},${lng}(${cleanLabel})`;
        }

        Linking.openURL(url)
            .then(() => {
                // Success! Set the flag. Navigation will happen when the app returns.
                setShouldNavigateOnFocus(true);
            })
            .catch((err) => {
                console.error('Failed to open map app:', err);
                Alert.alert('Map Error', 'Could not open the mapping application.');
                setShouldNavigateOnFocus(false); // Reset on error
            });
    };

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3B30" />
                <Text>Loading order details...</Text>
            </View>
        );
    }

    // Bill calculations
    const items = order?.items || [];
    const totalAmount = items.reduce(
        (sum, i) => sum + (i.price || i.total_price || 0) * (i.quantity || 1), 0
    );
    const promo = Number(order?.promoDiscount || 0);
    const deliveryCharge = Number(order?.deliveryCharge || order?.delivery_charge || 0);
    const tax = Number(order?.tax || 0);
    const total = totalAmount - promo + deliveryCharge + tax;
    const savings = promo;

    const customerAddress = order?.address?.full_address || order?.address?.area || 'Address not available';
    const status = order?.delivery_status || order?.status || 'In Process';
    const chefName = order?.chef?.name || 'Chef';
    const chefInitials = chefName.split(' ').map(n => n[0]).join('').toUpperCase();
    const chefProfilePic = order?.chef?.profile_pic ? `${API_BASE}${order.chef.profile_pic}` : null;


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.orderNumber}>Order #{order?._id?.slice(-5) || 'N/A'}</Text>
                <TouchableOpacity><Text style={styles.helpText}>Help</Text></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                {/* Chef Info */}
                <View style={styles.chefCard}>
                    {chefProfilePic ? (
                        <Image source={{ uri: chefProfilePic }} style={styles.chefImage} />
                    ) : (
                        <View style={[styles.chefImage, styles.chefInitials]}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{chefInitials}</Text>
                        </View>
                    )}
                    <View style={styles.chefDetails}>
                        <Text style={styles.chefName}>{chefName}</Text>
                        <Text style={styles.chefLocation}>{chefArea || 'Fetching Location...'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleCall(order?.chef?.phone || order?.chef?.phone_number)}
                        style={styles.callButton}
                    >
                        <Ionicons name="call" size={24} color="#00A86B" />
                    </TouchableOpacity>
                </View>

                {/* Order Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.statusText}>Order Status: {status.toUpperCase()}</Text>
                    <Text style={styles.infoText}>Order Id: <Text style={styles.boldText}>#{order?._id?.slice(-5) || 'N/A'}</Text></Text>
                    <Text style={styles.infoText}>Customer Name: {order?.customer?.name || 'Unknown'}</Text>
                    <Text style={styles.infoText}>Delivery Location: {customerAddress}</Text>
                </View>

                {/* Bill Summary */}
                <View style={styles.billCard}>
                    <Text style={styles.sectionTitle}>Bill Summary</Text>
                    {items.map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <Text>{item.food_name || item.name} x{item.quantity || 1}</Text>
                            <Text>₹{(item.price || item.total_price || 0) * (item.quantity || 1)}</Text>
                        </View>
                    ))}

                    <View style={[styles.summaryRow, { marginTop: 10 }]}>
                        <Text>Subtotal</Text>
                        <Text>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Promo</Text>
                        <Text style={{ color: '#00A86B' }}>-₹{promo.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Delivery Charges</Text>
                        <Text>₹{deliveryCharge.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Tax</Text>
                        <Text>₹{tax.toFixed(2)}</Text>
                    </View>
                    
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.savingsText}>Your Total Savings: <Text style={{fontWeight: 'bold'}}>₹{savings.toFixed(2)}</Text></Text>
                </View>
            </ScrollView>

            {/* Navigate Button - Now launches external map */}
            <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => navigateToChef(order.chef?.location?.coordinates, chefName)}
            >
                <Text style={styles.navigateText}>Navigate to Restaurant (Open Maps)</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OrderDetailsScreen;

// ... (Styles remain the same) ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 45,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderNumber: { fontSize: 16, fontWeight: 'bold' },
    helpText: { color: '#FF3B30', fontWeight: '600' },
    chefCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 1,
    },
    chefImage: { width: 40, height: 40, borderRadius: 20 },
    chefInitials: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chefDetails: { flex: 1, marginLeft: 12 },
    chefName: { fontWeight: 'bold', fontSize: 15 },
    chefLocation: { fontSize: 12, color: 'gray' },
    callButton: { padding: 6, backgroundColor: '#E6F7F0', borderRadius: 20 },
    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 1,
    },
    statusText: { color: '#FF3B30', fontWeight: '600', marginBottom: 6 },
    infoText: { marginBottom: 4, fontSize: 13, color: '#333' },
    boldText: { fontWeight: 'bold', color: '#000' },
    billCard: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 1,
    },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, fontSize: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3, fontSize: 14 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
    totalText: { fontWeight: 'bold', fontSize: 16 },
    savingsText: { color: '#00A86B', marginTop: 10, fontSize: 14 },
    navigateButton: {
        position: 'absolute',
        bottom: 0,
        width: '90%',
        marginHorizontal: '5%',
        backgroundColor: '#FF3B30',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    navigateText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});