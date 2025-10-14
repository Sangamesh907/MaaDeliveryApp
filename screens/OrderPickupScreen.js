import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DeliveryContext } from '../Context/DeliveryContext';

const haversineDistance = (coords1, coords2) => {
  const toRad = x => x*Math.PI/180;
  const [lat1, lon1]=[coords1.latitude, coords1.longitude];
  const [lat2, lon2]=[coords2.latitude, coords2.longitude];
  const R=6371;
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return (R*c).toFixed(2);
};

const OrderPickupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  const { fetchOrderById, currentLocation } = useContext(DeliveryContext);

  const [order, setOrder] = useState(null);
  const [chefArea, setChefArea] = useState('Unknown');
  const [distance, setDistance] = useState('N/A');

  useEffect(()=>{
    if(orderId) loadOrder(orderId);
  },[orderId]);

  useEffect(()=>{
    if(order?.customer?.location && currentLocation){
      setDistance(haversineDistance(currentLocation, { latitude: order.customer.location.coordinates[1], longitude: order.customer.location.coordinates[0] }));
    }
  },[currentLocation, order]);

  const loadOrder = async (id)=>{
    const data = await fetchOrderById(id);
    if(data){ setOrder(data); fetchChefArea(data.chef); }
  };

  const fetchChefArea = async (chef)=>{
    try{
      const coords=chef?.location?.coordinates;
      if(coords?.length===2){
        const [lng,lat]=coords;
        const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data=await res.json();
        const area=data.address?.suburb || data.address?.city || data.address?.town || data.address?.village || 'Unknown';
        setChefArea(area);
      }
    }catch(err){ console.warn('Failed to fetch chef area', err); }
  };

  if(!order) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading order details...</Text></View>;

  const customer = order.customer || {};

  const handleCallCustomer = ()=>{ if(customer.phone) Linking.openURL(`tel:${customer.phone}`); };

  const progressSteps = [
    { key:'confirmed', icon:'checkmark-done-outline', title:'Order Confirmed', subtitle:'Order confirmed', time:order.confirmedAt },
    { key:'preparing', icon:'restaurant-outline', title:'Order Preparing', subtitle:'Preparing your order', time:order.preparingAt },
    { key:'onTheWay', icon:'bicycle-outline', title:'On the Way', subtitle:'Delivery in progress', time:order.onTheWayAt },
  ];

  return (
    <ScrollView contentContainerStyle={{paddingBottom:100}}>
      {/* Chef Info */}
      <View style={styles.chefCard}>
        <Image source={{ uri: order.chef?.profile_pic ? `http://3.110.207.229${order.chef.profile_pic}` : 'https://via.placeholder.com/50' }} style={styles.chefImage}/>
        <View style={{flex:1,marginLeft:10}}>
          <Text style={{fontWeight:'bold',fontSize:16}}>{order.chef?.name||'Chef'}</Text>
          <Text style={{fontSize:12,color:'gray'}}>{chefArea}</Text>
        </View>
        <TouchableOpacity onPress={()=>Linking.openURL(`tel:${order.chef?.phone}`)}>
          <Ionicons name="call" size={24} color="#00A86B"/>
        </TouchableOpacity>
      </View>

      {/* Customer Info */}
      <View style={styles.customerCard}>
        <Image source={require('../assets/profile.png')} style={styles.customerImage}/>
        <View style={{flex:1,marginLeft:10}}>
          <Text style={{fontWeight:'bold',fontSize:16}}>{customer.name||'Customer'}</Text>
          <Text style={{color:'gray'}}>Customer</Text>
        </View>
        <TouchableOpacity onPress={handleCallCustomer}>
          <Ionicons name="call" size={20} color="#000"/>
        </TouchableOpacity>
        <View style={styles.distanceBox}>
          <Text style={{color:'#00A86B',fontWeight:'600'}}>• {distance} km</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={{marginTop:16,paddingHorizontal:16}}>
        {progressSteps.map(step=>(
          <View key={step.key} style={styles.progressItem}>
            <Ionicons name={step.icon} size={26} color="#00A86B" style={{marginRight:10}}/>
            <View style={{flex:1}}>
              <Text style={{fontWeight:'bold'}}>{step.title}</Text>
              <Text style={{color:'gray',fontSize:12}}>{step.subtitle}</Text>
            </View>
            <Text style={{color:'gray',fontSize:12}}>{step.time?step.time.split('T')[1].slice(0,5):'--:--'}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={()=>navigation.navigate('ReachedDestination',{orderId:order._id})}>
        <Ionicons name="navigate" size={16} color="#fff"/>
        <Text style={{color:'#fff',fontWeight:'bold',fontSize:16}}>  Start Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chefCard:{flexDirection:'row',alignItems:'center',padding:16,backgroundColor:'#f6f6f6',margin:16,borderRadius:12},
  chefImage:{width:50,height:50,borderRadius:25},
  customerCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#f6f6f6',marginHorizontal:16,padding:16,borderRadius:12,marginTop:10},
  customerImage:{width:48,height:48,borderRadius:24},
  distanceBox:{backgroundColor:'#dff6f0',paddingHorizontal:8,paddingVertical:4,borderRadius:8,marginLeft:8},
  progressItem:{flexDirection:'row',alignItems:'center',marginBottom:20},
  startButton:{marginTop:20,marginHorizontal:16,backgroundColor:'#FF3B30',paddingVertical:14,borderRadius:50,flexDirection:'row',justifyContent:'center',alignItems:'center'},
});

export default OrderPickupScreen;
