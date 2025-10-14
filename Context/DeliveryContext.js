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
  const [token, setToken] = useState(null);
  const [deliveryId, setDeliveryId] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  const wsRef = useRef(null);
  const watchIdRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

  // --- Safe Navigation ---
  const safeNavigate = (screen, params) => {
    if (navigationRef.isReady()) {
      console.log(`🌐 Navigating to screen: ${screen} with params:`, params);
      navigationRef.navigate(screen, params);
    } else console.warn('⚠️ Navigation not ready:', screen, params);
  };

  // --- Load saved auth/profile ---
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

        console.log('📦 Loaded saved auth/profile:', {
          token: !!savedToken,
          deliveryId: savedDeliveryId,
          role: savedRole,
          profile: !!savedProfile,
        });
      } catch (err) {
        console.warn('⚠️ Failed to load auth/profile', err);
      }
    })();
  }, []);

  // --- Save auth/profile ---
  const saveAuth = async ({ token: t, deliveryId: id, role: r, profileData: p }) => {
    try {
      if (t) { await AsyncStorage.setItem(STORAGE_TOKEN_KEY, t); setToken(t); console.log('💾 Token saved'); }
      if (id) { await AsyncStorage.setItem(STORAGE_DELIVERY_ID_KEY, id.toString()); setDeliveryId(id.toString()); console.log('💾 Delivery ID saved'); }
      if (r) { await AsyncStorage.setItem(STORAGE_ROLE_KEY, r); setRole(r); console.log('💾 Role saved'); }
      if (p) { await AsyncStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(p)); setProfile(p); console.log('💾 Profile saved'); }
      console.log('💾 Auth & profile saved successfully');
    } catch (err) { console.warn('⚠️ saveAuth error', err); }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_TOKEN_KEY,
        STORAGE_DELIVERY_ID_KEY,
        STORAGE_ROLE_KEY,
        STORAGE_PROFILE_KEY,
      ]);
      console.log('🔒 Logged out successfully');
    } catch (err) { console.warn('⚠️ logout error', err); }
    finally {
      disconnectWebSocket();
      stopLocationTracking();
      setToken(null); setDeliveryId(null); setRole(null);
      setProfile(null); setOrders([]); setOngoingOrders([]); setIsOnline(false);
      console.log('🛑 Context reset after logout');
    }
  };

  // --- Axios request helper ---
  const authApi = (method, url, data = null) => {
    if (!token) throw new Error('Token missing');
    console.log(`📤 API Request: [${method.toUpperCase()}] ${url}`, data || '');
    return api.request({
      method,
      url,
      data,
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // --- Fetch Delivery Profile ---
  const fetchDeliveryProfile = async () => {
    try {
      const res = await authApi('get', '/deliveryme');
      setProfile(res.data);
      console.log('📝 Delivery profile fetched:', res.data);
      return res.data;
    } catch (err) {
      console.warn('❌ Failed to fetch profile', err?.response?.data || err.message || err);
    }
  };

  // --- Fetch ongoing orders ---
  const fetchOngoingOrders = async () => {
    if (!token) return console.warn('⚠️ Token missing, cannot fetch ongoing orders.');
    try {
      const res = await authApi('get', '/orders/delivery/me');
      const fetched = Array.isArray(res.data.orders) ? res.data.orders : [];
      const normalized = fetched.map(o => ({ ...o, id: o._id }));
      setOngoingOrders(normalized);
      console.log('✅ Ongoing orders fetched:', normalized);
    } catch (err) {
      console.warn('❌ fetchOngoingOrders error', err?.response?.data || err.message || err);
    }
  };

  // --- Update Order Status ---
  const validStatuses = ['assigned', 'picked', 'delivered'];

  const updateOrderStatus = async (orderId, status) => {
    if (!token) return console.warn('⚠️ Cannot update order status: token missing');

    if (!validStatuses.includes(status)) {
      console.warn('⚠️ Invalid order status:', status);
      return;
    }

    try {
      const res = await authApi('put', `/orderdeliveryupdate/${orderId}/status`, { status });
      console.log('📦 Order status updated:', res.data);

      setOngoingOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, status: res.data.new_delivery_status, updatedAt: new Date().toISOString() }
            : o
        )
      );

      return res.data;
    } catch (err) {
      console.warn('❌ Failed to update order status:', err?.response?.data || err.message);
    }
  };

  // --- WebSocket management ---
  const scheduleReconnect = (id) => {
    if (reconnectTimerRef.current) return;
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      console.log('🔄 Reconnecting WebSocket...');
      connectWebSocket(id);
    }, 5000);
  };

  const disconnectWebSocket = () => {
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
    if (wsRef.current) { try { wsRef.current.close(1000, 'Client disconnect'); } catch {} wsRef.current = null; }
    setIsOnline(false);
    console.log('📴 WebSocket disconnected');
  };

  const connectWebSocket = (id) => {
    if (!id || !token) return;
    if (wsRef.current) { try { wsRef.current.close(1000, 'Reconnect'); } catch {} wsRef.current = null; }

    wsRef.current = new WebSocket(`ws://3.110.207.229/api/ws/delivery/${id}`);

    wsRef.current.onopen = () => {
      setIsOnline(true);
      console.log('✅ WebSocket connected');
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
      fetchOngoingOrders();
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 WS message:', data);

        if (data.type === 'order_request' && data.order_id) {
          Alert.alert(
            '📦 New Order',
            `Order ID: ${data.order_id}`,
            [
              { text: 'Reject', style: 'destructive', onPress: () => respondOrder(data.order_id, 'reject') },
              { text: 'Accept', style: 'default', onPress: () => respondOrder(data.order_id, 'accept') }
            ]
          );
          setOrders(prev => [
            { id: data.order_id, status: 'pending', orderedOn: new Date().toISOString(), chefName: 'Chef', items: 'N/A' },
            ...prev
          ]);
          safeNavigate('OrderTracking', { orderId: data.order_id });
        }

        if (data.type === 'order_status') {
          setOngoingOrders(prev =>
            prev.map(o => o.id === data.order_id ? { ...o, status: data.status, updatedAt: new Date().toISOString() } : o)
          );
        }

      } catch (err) { console.warn('⚠️ WS parse error', err); }
    };

    wsRef.current.onerror = (err) => { console.error('❌ WS error', err); setIsOnline(false); scheduleReconnect(id); };
    wsRef.current.onclose = (evt) => { setIsOnline(false); if (evt?.code !== 1000) scheduleReconnect(id); console.log('📴 WebSocket closed', evt?.code); };
  };

  // --- Respond to Order ---
  const respondOrder = (orderId, response) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    let backendStatus = null;

    if (response === 'accept') backendStatus = 'assigned';
    else if (response === 'picked') backendStatus = 'picked';
    else if (response === 'delivered') backendStatus = 'delivered';
    else if (response === 'reject') backendStatus = null; // don’t send invalid status

    if (backendStatus) updateOrderStatus(orderId, backendStatus);

    wsRef.current.send(JSON.stringify({ type: 'order_response', order_id: orderId, response }));
    console.log(`📤 Responded to order ${orderId} with ${response} (mapped: ${backendStatus})`);
  };

  // --- Location tracking ---
  const startLocationTracking = async () => {
    if (role !== 'delivery') return;
    if (!token) return console.warn('⚠️ Cannot start location tracking: token missing');
    if (watchIdRef.current) return;

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('⚠️ Location permission denied');
        return;
      }
    }

    watchIdRef.current = Geolocation.watchPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          await authApi('post', '/deliveryupdate', { latitude, longitude, status: true });
          console.log('📍 Location updated:', latitude, longitude);
        } catch (err) {
          console.warn('⚠️ Failed to update location:', err?.response?.data || err.message);
          if (err?.response?.status === 401) logout();
        }
      },
      (error) => console.warn('⚠️ Location watch error:', error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
    );

    console.log('🚦 Location tracking started');
  };

  const stopLocationTracking = async () => {
    if (watchIdRef.current !== null) {
      try { Geolocation.clearWatch(watchIdRef.current); } catch {}
      watchIdRef.current = null;

      try {
        await authApi('post', '/deliveryupdate', { latitude: 0, longitude: 0, status: false });
        console.log('🛑 Location tracking stopped');
      } catch (err) {
        console.warn('⚠️ Failed to stop location tracking:', err?.response?.data || err.message);
      }
    }
  };

  // --- App state handler ---
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('📱 App state changed:', nextAppState);
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (token && deliveryId && role === 'delivery') {
          connectWebSocket(deliveryId);
          fetchOngoingOrders();
          startLocationTracking();
        }
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [token, deliveryId, role]);

  // --- Connect WebSocket once token & deliveryId loaded ---
  useEffect(() => {
    if (token && deliveryId) connectWebSocket(deliveryId);
  }, [token, deliveryId]);

  return (
    <DeliveryContext.Provider value={{
      token,
      deliveryId,
      role,
      profile,
      orders,
      ongoingOrders,
      isOnline,
      saveAuth,
      logout,
      fetchDeliveryProfile,
      fetchOngoingOrders,
      setIsOnline,
      startLocationTracking,
      stopLocationTracking,
      connectWebSocket,
      safeNavigate,
      updateOrderStatus
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};
