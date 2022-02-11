import React, { useState, useEffect } from 'react';
import { AppLoading} from 'expo';
import { ActivityIndicator, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import {useFonts,Pacifico_400Regular} from '@expo-google-fonts/pacifico';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';

export default function Home() {
  const navigation = useNavigation();
  const destination = {latitude: 25.037998, longitude: 121.431877};
  const [destinaton, setdestination] = useState("您的所在地")
  const [search, setsearch] = useState("您的所在地");
  const [ylat, setylat] = useState(0.0);
  const [ylng, setylng] = useState(0.0);
  const [mark, setmark] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });
  // read data
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const [chargers, setCharger] = useState([]);
  async function readData(){
    const newChargers=[];
    try {
      const querySnapshot = await db.collection("chargers").get();
      querySnapshot.forEach((doc) => {
        let nlat = parseFloat(doc.data().lat);
        let nlng = parseFloat(doc.data().lng);
        const newCharger = {
          name:doc.data().name,
          lat:nlat,
          lng:nlng,
          address: doc.data().address,
          convenience_store: doc.data().convenience_store,
          cafe: doc.data().cafe,
          park: doc.data().park,
          restaurant: doc.data().restaurant,
        }
        newChargers.push(newCharger);
        console.log(newCharger);
      });//foreach
      setCharger(newChargers);
    }//try
  catch(e){console.log(e);}
  }//readData

  // read current location
  const [isLoading, setIsLoading] = useState(true);
  const [Region, setRegion] = useState({
    latitude: 24.99862,
    longitude: 121.4877,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        let text = 'Waiting..';
        let clat, clng;
        if (errorMsg) {
          text = errorMsg;
        } else if (location) {
          text = JSON.stringify(location);
          clat = parseFloat(JSON.stringify(location.coords.latitude));
          clng = parseFloat(JSON.stringify(location.coords.longitude));
          // setIsLoading(false);
        }
        if(clat!=undefined && clng!=undefined){
          setRegion({
            latitude: clat,
            longitude: clng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
          setylat(clat);
          setylng(clng);
          console.log(clat);
          console.log(clng);
          setmark({
            latitude: clat,
            longitude: clng,
          });
          setIsLoading(false);
        }
      })();
      readData();
    }
  },[]);

  async function Searchdot(){
    let dot = await Location.geocodeAsync(search);
    console.log(dot);
    setdestination(search)
    console.log(dot);
    let dlat = parseFloat(dot[0].latitude);
    let dlng = parseFloat(dot[0].longitude);
    console.log(dlat);
    console.log(dlng);
    setRegion({
      latitude: dlat,
      longitude: dlng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setmark({
      latitude: dlat,
      longitude: dlng,
    });
  }

  async function Backdot(){
    setsearch("您的所在地")
    setdestination("您的所在地")
    setRegion({
      latitude: ylat,
      longitude: ylng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setmark({
      latitude: ylat,
      longitude: ylng,
    });
  }
  
  // use font
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  else{
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.TitleContainer}>
          <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 30}}>Life Charger</Text>
        </View>
        <View>
          <View style={styles.SearchContainer}>
            <TextInput style={{ width:'70%' , height: 50, borderColor: 'black', borderWidth: 1, marginLeft: 25}} placeholder="請輸入您要搜尋的目的地"
              onChangeText={text=>setsearch(text)}
            />
            <TouchableOpacity style={styles.SearchBtn} onPress={Searchdot}>
              <Text>搜尋</Text>
            </TouchableOpacity>
          </View>
          {!isLoading ?
            <View>
              <Text style={{ top: 25, marginLeft: 28}}>目前定位 : {search}</Text>
              <MapView 
                style={styles.mapStyle}
                region={Region}
              >
                {chargers.map((item, i) => (
                  <MapView.Marker
                  key={i}
                  coordinate={{latitude: item.lat,
                      longitude: item.lng}}
                  onCalloutPress={() => navigation.navigate('preconfirm',{
                    name: item.name,
                    lat: item.lat,
                    lng: item.lng
                  })}
                  >
                    <MapView.Callout>
                      <View style={styles.ViewContainer}>
                        <Text>名稱: {item.name}</Text>
                        <Text>地址: {item.address}</Text>
                        <View style={styles.ViewContent}>
                          <Text>便利商店: {item.convenience_store} </Text>
                          <Text>咖啡店: {item.cafe}</Text>
                        </View>
                        <View style={styles.ViewContent}>
                          <Text>餐廳: {item.restaurant}</Text>
                        </View>
                        <View style={styles.ViewContent}>
                          <Text>公園: {item.park} </Text>
                        </View>
                        <View style={styles.ViewContent}>
                          <Text>按我預約!</Text>
                        </View>
                      </View>
                    </MapView.Callout>
                  </MapView.Marker>
                ))}
                <MapView.Marker
                  coordinate={mark}
                  title={destinaton}
                  pinColor={'#005AB5'}
                />
              </MapView>
              <TouchableOpacity style={styles.button} onPress={Backdot}>
                <Text>返回所在地</Text>
              </TouchableOpacity>
            </View>
            :
            <ActivityIndicator color="fff" size="large" animating={isLoading} style={{top:400}} />
            }
        </View>
        
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    alignItems: 'center'
  },
  TitleContainer: {
    top:20 ,
    alignItems: 'center',
  },
  mapStyle: {
    top: 35,
    marginLeft: 15,
    marginRight: 15,
    width: 400,
    height: '78%'
  },
  SearchContainer: {
    top: 20,
    flexDirection: 'row'
  },
  ViewContainer: {
    alignItems: 'center',
    height:'100%',
    width:260,
    justifyContent: 'center',
  },
  ViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  SearchBtn: {
    width: '20%',
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#E0FFFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    top:35,
    margin: 4,
    padding: 10,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:130,
    marginBottom:15,
    borderColor:'#64b8de',
    borderWidth:3,
    marginLeft: 150,
    // marginRight: 40,
  },
});
