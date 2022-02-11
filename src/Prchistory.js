import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Linking, LogBox, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';
import MapView from 'react-native-maps';


export default function Prchistory() {
  const navigation = useNavigation();
  LogBox.ignoreLogs(['Setting a timer']);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const [newchistorys, setnewcHistory] = useState(false);
  const [chistorys, setHistory] = useState([]);
  async function readData(){
    const newHistorys=[];
    try {
      const user_id = firebase.auth().currentUser.uid;
      // console.log(user_id);
      const querySnapshot = await db.collection("history").where("uid", "==", user_id).where("done", "==", false).orderBy("date", "desc").get();
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        let rdate = doc.data().date.toDate();
        let nlat = parseFloat(doc.data().lat);
        let nlng = parseFloat(doc.data().lng);
        const newHistory = {
          did: id,
          date: rdate,
          charger: doc.data().charger,
          slat: nlat,
          slng: nlng
        }
        newHistorys.push(newHistory);
        console.log(newHistorys);
      });//foreach
      if(newHistorys.length==0){
        Alert.alert('系統通知', 
            '您目前尚無預約紀錄!',
            [
              { text: "確定" , onPress: () => navigation.navigate('前往充電')}
            ]
        )
      }
      setHistory(newHistorys);
    }//try
  catch(e){console.log(e);}
  }//readData
  useEffect(() => {
      readData();
    },[newchistorys]);
  function tonavi(lat, lng, name){
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo: 0,0?q='
    });
    const latLng = `${lat},${lng}`
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${label}`
    });
    Linking.openURL(url)
  }
  function update(){
    if(newchistorys==true){
      setnewcHistory(false);
    }
    else{
      setnewcHistory(true);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25}}>我的預約</Text>
        <TouchableOpacity style={styles.buttonupdate} onPress={update}>
          <Text>refresh</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{top:40}} update={update}>
        {chistorys.map((item, i)=>(
          <View style={styles.cardContainer} key={i}>
            <View>
              <Text>{item.date.toDateString().slice(4, 15)} {item.date.toTimeString().slice(0, 5)}</Text>
            </View>
            <View>
              <Text>{item.charger}</Text>
            </View>
            <MapView
              style={styles.mapStyle}
              initialRegion={{
                latitude: item.slat,
                longitude: item.slng,
                latitudeDelta: 0.0009,
                longitudeDelta: 0.0005,
              }}
              zoomEnabled={false}
            >
              <MapView.Marker
                  coordinate={{latitude: item.slat,
                    longitude: item.slng}}
                  pinColor={'#005AB5'}
              />
            </MapView>
            <View style={{flexDirection: 'row',paddingTop:10}}>
              <TouchableOpacity style={styles.button} onPress={()=>tonavi(item.lat, item.lng, item.charger)}>
                <Text>導航</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('schedule',{
                chargername: item.charger,
                chargerlat: item.slat,
                chargerlng: item.slng,
                id: item.did
              })}>
                <Text>規劃行程</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('cancel',{
                id: item.did
              })}>
                <Text>取消預約</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
  },
  TitleContainer: {
    top:45,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardContainer: {
    width: 400,
    height: 250,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingTop:15
  },
  button: {
    margin: 4,
    padding: 4,
    backgroundColor: '#CCEEFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: '95%',
    height: '50%',
  },
  buttonupdate: {
    margin: 4,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 9,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }
});
