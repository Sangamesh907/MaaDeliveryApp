// Context/DeliveryContext.js
import React, { createContext, useState, useRef, useEffect } from 'react';
import { AppState, Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../RootNavigation';

export const DeliveryContext = createContext();

const API_BASE = 'http://3.110.207.229/api';
const STORAGE_TOKEN_KEY = '@delivery_token';
const STORAGE_DELIVERY_ID_KEY = '@delivery_id';
const STORAGE_ROLE_KEY = '@delivery_role';
const STORAGE_PROFILE_KEY = '@delivery_profile';

export const DeliveryProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [token, setToken] = useState(null);
  const [deliveryId, setDeliveryId] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [acceptedOrderId, setAcceptedOrderId] = useState(null); // NEW

  const wsRef = useRef(null);
  const watchIdRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const api = axios.create({ baseURL: API_BASE, timeout: 15000 });
  const validStatuses = ['assigned', 'picked', 'delivered'];

  // --- Safe navigation ---
  const safeNavigate = (screen, params) => {
    if (navigationRef.isReady()) navigationRef.navigate(screen, params);
    else console.warn('[Context] Navigation not ready:', screen, params);
  };

  // --- Load saved auth/profile on mount ---
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
        const savedDeliveryId = await AsyncStorage.getItem(STORAGE_DELIVERY_ID_KEY);
        const savedRole = await AsyncStorage.getItem(STORAGE_ROLE_KEY);
        const savedProfile = await AsyncStorage.getItem(STORAGE_PROFILE_KEY);

        if (savedToken) setToken(savedToken);
        if (savedDeliveryId) setDeliveryId(savedDeliveryId);
        if (savedRole) setRole(savedRole);
        if (savedProfile) setProfile(JSON.parse(savedProfile));

        console.log('[Context] 📦 Loaded saved credentials');
      } catch (err) {
        console.warn('[Context] ⚠️ Failed to load saved data', err);
      }
    })();
  }, []);

  // --- Save token & profile ---
  const saveAuth = async ({ token: t, deliveryId: id, role: r, profileData: p }) => {
    try {
      if (t) { await AsyncStorage.setItem(STORAGE_TOKEN_KEY, t); setToken(t); }
      if (id) { await AsyncStorage.setItem(STORAGE_DELIVERY_ID_KEY, id.toString()); setDeliveryId(id.toString()); }
      if (r) { await AsyncStorage.setItem(STORAGE_ROLE_KEY, r); setRole(r); }
      if (p) { await AsyncStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(p)); setProfile(p); }
      console.log('[Context] 💾 Auth & Profile saved');
    } catch (err) {
      console.warn('[Context] ⚠️ saveAuth error', err);
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_TOKEN_KEY, STORAGE_DELIVERY_ID_KEY, STORAGE_ROLE_KEY, STORAGE_PROFILE_KEY]);
    } catch (err) {
      console.warn('[Context] ⚠️ logout error', err);
    } finally {
      disconnectWebSocket();
      stopLocationTracking();
      setToken(null); setDeliveryId(null); setRole(null); setProfile(null);
      setOrders([]); setOngoingOrders([]); setOrderHistory([]); setIsOnline(false);
      setAcceptedOrderId(null);
      console.log('[Context] 🔒 Logged out');
    }
  };

  // --- Axios helper with token ---
  const authApi = async (method, url, data = null) => {
    if (!token) throw new Error('Token missing');
    try {
      const response = await api.request({ method, url, data, headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      console.warn(`[Context] ❌ API Error: ${url}`, error?.response?.data || error.message);
      throw error;
    }
  };

  // --- Fetch Delivery Profile ---
  const fetchDeliveryProfile = async () => {
    if (!token) return null;
    try {
      const res = await authApi('get', '/deliveryme');
      setProfile(res.data);
      await AsyncStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(res.data));
      console.log('[Context] 📝 Profile fetched', res.data);
      return res.data;
    } catch (err) {
      console.warn('[Context] ❌ Failed to fetch profile', err?.response?.data || err.message);
      return null;
    }
  };

 // --- Orders Logic ---
const fetchOrders = async () => {
  if (!token) return;
  setLoadingOrders(true);
  try {
    const res = await authApi('get', '/deliveryboy/orders');
    const data = res.data;

    if (data.status === 'success') {
      // Helper to normalize orders
      const normalizeOrders = (arr) =>
        (arr || []).map(o => ({
          ...o,
          id: o._id || o.id,
          customerName:
            o.customer?.name && o.customer.name !== 'Unknown'
              ? o.customer.name
              : o.address?.label || 'Customer',
          orderNumber: o._id?.slice(-5).toUpperCase() || 'N/A',
          totalAmount: o.total_price || o.total || 0,
          createdDate: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A',
          statusText: o.delivery_status || o.status || 'N/A',
        }));

      const ongoing = normalizeOrders(data.ongoing_orders);
      const past = normalizeOrders(data.past_orders);

      setOngoingOrders(ongoing);
      setOrderHistory(past);
      setOrders([...ongoing, ...past]);

      console.log(`[Context] ✅ Orders fetched: ongoing=${ongoing.length}, past=${past.length}`);
    } else {
      setOngoingOrders([]);
      setOrderHistory([]);
      setOrders([]);
      console.warn('[Context] ⚠️ fetchOrders returned no orders');
    }
  } catch (err) {
    console.warn('[Context] ❌ fetchOrders error', err?.response?.data || err.message);
    setOngoingOrders([]);
    setOrderHistory([]);
    setOrders([]);
  } finally {
    setLoadingOrders(false);
  }
};


 // --- Update Order Status ---
const updateOrderStatus = async (orderId, status) => {
  console.log("🚀 updateOrderStatus CALLED:", { orderId, status });

  // Updated list to match backend
  const allowedStatuses = [
    "assigned",
    "chef_arrived",
    "picked_up",
    "out_for_delivery",
    "delivered",
  ];

  if (!allowedStatuses.includes(status)) {
    console.warn("⚠️ Invalid status requested:", status);
    return;
  }

  try {
    const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
    console.log("🔑 Token retrieved:", token ? "✅ Found" : "❌ Missing");

    const url = `${API_BASE}/orderdeliveryupdate/${orderId}/status`;
    console.log("🌍 PUT URL:", url);

    const response = await axios.put(
      url,
      { status }, // Backend expects {"status": "chef_arrived"}
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Order status updated successfully:", response.data);

    // Refresh orders after update
    fetchOrders();
    return response.data;

  } catch (err) {
    console.error(
      "❌ Failed to update order status:",
      err.response?.data || err.message
    );
    Alert.alert(
      "Update Failed",
      err.response?.data?.detail || "Could not update status"
    );
  }
};

  // --- WebSocket ---
  const scheduleReconnect = (id) => {
    if (reconnectTimerRef.current) return;
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      connectWebSocket(id);
    }, 5000);
  };

  const disconnectWebSocket = () => {
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
    if (wsRef.current) { try { wsRef.current.close(1000, 'Client disconnect'); } catch {} wsRef.current = null; }
    setIsOnline(false);
    console.log('[Context] 📴 WS disconnected');
  };

  const connectWebSocket = (id) => {
    if (!id || !token) return;
    if (wsRef.current) { try { wsRef.current.close(1000, 'Reconnect'); } catch {} wsRef.current = null; }

    const wsUrl = `ws://3.110.207.229/api/ws/delivery/${id}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = async () => {
      console.log('[Context] ✅ WS connected');
      setIsOnline(true);
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
      fetchOrders();
      fetchDeliveryProfile();
      if (role === 'delivery') startLocationTracking();
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[Context] 📩 WS Message:', data);
        if (['order_request', 'order_accepted', 'order_status', 'order_update'].includes(data.type)) fetchOrders();
        if (data.type === 'order_accepted' && data.order_id) setAcceptedOrderId(data.order_id);
        if (data.type === 'order_request' && data.order_id) {
          Alert.alert(
            '📦 New Order',
            `Order ID: ${data.order_id}`,
            [
              { text: 'Reject', style: 'destructive', onPress: () => respondOrder(data.order_id, 'reject') },
              { text: 'Accept', onPress: () => { respondOrder(data.order_id, 'accept'); setAcceptedOrderId(data.order_id); safeNavigate('DeliveryTracking', { orderId: data.order_id }); }},
            ]
          );
        }
      } catch (err) { console.warn('[Context] ⚠️ WS parse error', err); }
    };

    wsRef.current.onerror = (err) => { console.error('[Context] ❌ WS Error', err?.message || err); setIsOnline(false); scheduleReconnect(id); };
    wsRef.current.onclose = (evt) => { console.log(`[Context] 🔴 WS Closed (Code: ${evt?.code})`); setIsOnline(false); if (evt?.code !== 1000) scheduleReconnect(id); };
  };

  const respondOrder = async (orderId, response) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'order_response', order_id: orderId, response }));
    console.log(`[Context] 📤 Responded ${response} for ${orderId}`);
    fetchOrders();
  };

  // --- Location Tracking ---
  const startLocationTracking = async () => {
    if (role !== 'delivery' || !token || watchIdRef.current) return;
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) { Alert.alert('Permission Denied', 'Allow location access'); return; }
    }
    watchIdRef.current = Geolocation.watchPosition(
      async ({ coords }) => {
        try { await authApi('post', '/delivery/update-location', { latitude: coords.latitude, longitude: coords.longitude }); }
        catch (err) { console.warn('[Context] ❌ Failed to send location', err.message); }
      },
      err => console.warn('[Context] ⚠️ Geo Error', err.message),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 3000 }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current != null) { Geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
  };

  // --- AppState watcher ---
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        if (deliveryId && token) connectWebSocket(deliveryId);
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [deliveryId, token]);

  // --- Connect WS on mount after token & deliveryId ---
  useEffect(() => { if (deliveryId && token) connectWebSocket(deliveryId); }, [deliveryId, token]);

  return (
    <DeliveryContext.Provider value={{
      isOnline,
      orders,
      ongoingOrders,
      orderHistory,
      loadingOrders,
      token,
      deliveryId,
      role,
      profile,
      acceptedOrderId,
      setAcceptedOrderId,
      fetchDeliveryProfile,
      saveAuth,
      logout,
      fetchOrders,
      updateOrderStatus,
      respondOrder,
      connectWebSocket,
      disconnectWebSocket,
      startLocationTracking,
      stopLocationTracking,
      setIsOnline,
      safeNavigate,
      authApi
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};
