import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Linking,
    Image,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps'; 
import Geolocation from 'react-native-geolocation-service';
import { DeliveryContext } from '../Context/DeliveryContext';

const API_BASE = 'http://3.110.207.229';

const DeliveryTrackingScreen = ({ route, navigation }) => {
    const { orderId, orderData } = route.params;
    const { authApi, updateOrderStatus, fetchOrders } = useContext(DeliveryContext); 

    const [order, setOrder] = useState(orderData || null);
    const [loading, setLoading] = useState(orderData ? false : true);
    const [driverLocation, setDriverLocation] = useState(null);
    const driverWatchId = useRef(null);

    // --- Fetch Order Details ---
    const fetchOrderDetails = async () => {
        console.log('[DeliveryTracking] Fetching order details for:', orderId);
        if (!order) setLoading(true); 
        try {
            const res = await authApi('get', `/deliveryordertrack/${orderId}`); 
            console.log('[DeliveryTracking] Order fetch response:', res.data);
            if (res.data.status === 'success' && res.data.order) setOrder(res.data.order);
        } catch (err) {
            console.error('[DeliveryTracking] Failed to fetch order:', err);
        } finally {
            setLoading(false);
        }
        fetchOrders();
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // --- Map Navigation ---
    const openMaps = (coords, label) => {
        if (!coords || coords.length !== 2) return Alert.alert('Error', `${label} location not found`);
        const [lng, lat] = coords; 
        console.log('[DeliveryTracking] Opening map:', { lat, lng, label });
        const cleanLabel = encodeURIComponent(label);

        const url = Platform.OS === 'android' 
            ? `geo:${lat},${lng}?q=${lat},${lng}(${cleanLabel})`
            : `http://maps.apple.com/?daddr=${lat},${lng}&q=${cleanLabel}`;

        Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps app.'));
    };

    // --- Next Action Logic ---
    const getNextAction = (status) => {
        switch (status) {
            case 'assigned': 
            case 'order_accepted': 
                return { key: 'chef_arrived', text: 'Arrived at Restaurant' };
            case 'chef_arrived': 
                return { key: 'picked_up', text: 'Picked Up Order' }; // FIXED
            case 'picked_up': 
                return { key: 'navigate_customer', text: 'Navigate to Customer' };
            case 'navigating_customer':
                return { key: 'customer_arrived', text: 'Arrived at Customer' };
            case 'customer_arrived': 
                return { key: 'delivered', text: 'Complete Delivery' }; 
            default: return null;
        }
    };

    // --- Handle Action Button ---
    const handleAction = async () => {
    const next = getNextAction(order.delivery_status);
    if (!next) return console.warn('[DeliveryTracking] No next action for status:', order.delivery_status);
    
    setLoading(true);

    // Map frontend status to backend
    let backendStatus = next.key;
    if (next.key === 'picked_up') backendStatus = 'picked';
    if (next.key === 'customer_arrived') backendStatus = 'delivered';

    // Navigate customer map
    if (backendStatus === 'navigate_customer') {
        setLoading(false);
        openMaps(order.address?.coordinates, order.user?.name || 'Customer');
        setOrder(prev => ({ ...prev, delivery_status: 'navigating_customer' }));
        return;
    }

    try {
        console.log('[DeliveryTracking] Updating order status:', backendStatus);
        await updateOrderStatus(order._id, backendStatus);
        await fetchOrderDetails();
        console.log('[DeliveryTracking] Status updated to:', backendStatus);
        Alert.alert('Status Updated', `Order marked as: ${next.text}`);
        if (backendStatus === 'delivered') navigation.popToTop();
    } catch (err) {
        console.error('[DeliveryTracking] Error updating status:', err);
        Alert.alert('Update Error', 'Failed to update order status');
    } finally {
        setLoading(false);
    }
};

    if (loading || !order) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF3B30" />
                <Text style={{ marginTop: 10 }}>Loading Order...</Text>
            </View>
        );
    }

    const status = order.delivery_status;
    let nextAction = getNextAction(status);

    const chefCoords = order.chef?.location?.coordinates 
        ? { longitude: order.chef.location.coordinates[0], latitude: order.chef.location.coordinates[1] } 
        : null;
    const customerCoords = order.address?.coordinates 
        ? { longitude: order.address.coordinates[0], latitude: order.address.coordinates[1] } 
        : null;

    const isTargetCustomer = ['picked_up', 'navigating_customer', 'customer_arrived', 'delivered'].includes(status);
    const targetLocation = isTargetCustomer ? customerCoords : chefCoords;
    const targetName = isTargetCustomer ? 'Customer' : 'Chef';
    const targetProfileData = isTargetCustomer ? order.user : order.chef;

    const profilePicPath = targetProfileData?.profile_pic || targetProfileData?.profileImage; 
    const fullImageUrl = profilePicPath ? `${API_BASE}${profilePicPath}` : null;
    const targetProfileImageSource = fullImageUrl ? { uri: fullImageUrl } : null;
    const targetProfileName = targetProfileData?.name || targetName;
    const targetPhoneNumber = targetProfileData?.phone || targetProfileData?.phone_number;

    if (!targetLocation) return <View style={styles.center}><Text>Location data missing.</Text></View>;

    // --- Components ---
    const ActionButton = ({ nextAction }) => nextAction && (
        <TouchableOpacity 
            style={[styles.actionButton, nextAction.key === 'delivered' && { backgroundColor: '#FF3B30' }]} 
            onPress={handleAction}
            disabled={loading}
        >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.actionButtonText}>{nextAction.text}</Text>}
        </TouchableOpacity>
    );

    const StatusTracker = ({ currentStatus }) => {
        const allSteps = [
            { key: 'assigned', title: 'Order Confirmed', subtitle: 'Order is waiting for pickup' },
            { key: 'chef_arrived', title: 'At Restaurant', subtitle: 'Ready to pickup' },
            { key: 'picked_up', title: 'On the Way', subtitle: 'Delivery in progress' },
            { key: 'customer_arrived', title: 'At Customer', subtitle: 'Awaiting payment/hand-off' },
        ];
        const statuses = ['assigned', 'order_accepted', 'chef_arrived', 'picked_up', 'customer_arrived', 'delivered'];
        const checkCompleted = (stepKey) => statuses.indexOf(stepKey) <= statuses.indexOf(currentStatus);
        return (
            <View style={styles.statusContainer}>
                {allSteps.map((step, i) => (
                    <View key={step.key} style={styles.statusItem}>
                        <View style={styles.statusLineContainer}>
                            <Ionicons 
                                name={checkCompleted(step.key) ? 'checkmark-circle' : 'ios-radio-button-off'} 
                                size={20} 
                                color={checkCompleted(step.key) ? '#00C851' : '#ccc'} 
                            />
                            {i < allSteps.length - 1 && <View style={[styles.statusLine, { backgroundColor: checkCompleted(step.key) ? '#00C851' : '#ccc' }]} />}
                        </View>
                        <View style={styles.statusTextContent}>
                            <Text style={styles.statusTitle}>{step.title}</Text>
                            <Text style={styles.statusSubtitle}>{step.subtitle}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.trackingContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.orderNumber}>Order #{order._id.slice(-5)}</Text>
                <TouchableOpacity><Text style={styles.helpText}>Help</Text></TouchableOpacity>
            </View>

            <MapView
                style={styles.map}
                initialRegion={{ latitude: targetLocation.latitude, longitude: targetLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
                key={JSON.stringify(targetLocation)}
            >
                {driverLocation && <Marker coordinate={driverLocation} title="You"><Ionicons name="location-sharp" size={30} color="#007AFF" /></Marker>}
                {chefCoords && <Marker coordinate={chefCoords} title="Chef"><Ionicons name='business-sharp' size={30} color="#00A86B" /></Marker>}
                {customerCoords && <Marker coordinate={customerCoords} title="Customer"><Ionicons name='home-sharp' size={30} color="#FF3B30" /></Marker>}
            </MapView>

            <View style={styles.card}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.profileRow}>
                        {targetProfileImageSource ? (
                            <Image source={targetProfileImageSource} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.profileImage, { backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="person" size={24} color="#fff" />
                            </View>
                        )}
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={styles.customerName}>{targetName} - {targetProfileName}</Text>
                            <Text style={styles.distanceText}>{isTargetCustomer ? 'Delivering to Customer' : 'Proceeding to Restaurant'}</Text>
                        </View>
                        <TouchableOpacity style={styles.callBtn} onPress={() => {
                            if (targetPhoneNumber) Linking.openURL(`tel:${targetPhoneNumber}`);
                            else Alert.alert('Error', `${targetName} contact number is missing.`);
                        }}>
                            <Ionicons name="call" size={18} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <StatusTracker currentStatus={status} />
                </ScrollView>
                <ActionButton nextAction={nextAction} />
            </View>
        </View>
    );
};

export default DeliveryTrackingScreen;
const styles = StyleSheet.create({

trackingContainer: { flex: 1, backgroundColor: '#fff' },

center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

header: {

flexDirection: 'row',

padding: 16,

paddingTop: 45,

justifyContent: 'space-between',

alignItems: 'center',

position: 'absolute',

top: 0,

width: '100%',

zIndex: 10,

backgroundColor: 'rgba(255, 255, 255, 0.8)',

},

orderNumber: { fontSize: 16, fontWeight: 'bold' },

helpText: { color: '#FF3B30', fontWeight: '600' },

map: { width: '100%', height: '60%' },

card: {

flex: 1,

backgroundColor: '#fff',

borderTopLeftRadius: 20,

borderTopRightRadius: 20,

padding: 16,

paddingBottom: 100,

marginTop: -20,

elevation: 10,

shadowColor: '#000',

shadowOpacity: 0.1,

shadowOffset: { width: 0, height: -5 },

shadowRadius: 10,

},

profileRow: {

flexDirection: 'row',

alignItems: 'center',

marginBottom: 10,

paddingVertical: 5,

borderBottomWidth: 1,

borderBottomColor: '#f0f0f0',

},

profileImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccc' },

customerName: { fontSize: 16, fontWeight: 'bold' },

distanceText: { fontSize: 14, color: 'gray' },

callBtn: {

marginLeft: 'auto',

padding: 10,

borderRadius: 20,

backgroundColor: '#f5f5f5',

},

statusContainer: { marginVertical: 10, paddingHorizontal: 10 },

statusItem: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 0 },

statusLineContainer: {

alignItems: 'center',

marginRight: 10,

height: '100%',

},

statusLine: {

width: 2,

height: 35,

backgroundColor: '#ccc',

},

statusTextContent: { flex: 1, paddingTop: 2, paddingBottom: 15 },

statusTitle: { fontWeight: 'bold', fontSize: 14, color: '#333' },

statusSubtitle: { fontSize: 12, color: '#777' },

statusTime: { fontSize: 12, color: '#999', marginLeft: 10, paddingTop: 2 },

actionButton: {

position: 'absolute',

bottom: 20,

width: '90%',

marginHorizontal: '5%',

backgroundColor: '#00A86B',

padding: 18,

borderRadius: 10,

alignItems: 'center',

},

actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

});