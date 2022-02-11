import React, { useState, useEffect } from 'react';
import { AppLoading} from 'expo';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';

export default function RecFinRoute({route}) {
  const navigation = useNavigation();
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const{id} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [Catches, setCatches] = useState([]);
  const [LCatches, setLCatches] = useState([]);
  const [Destination, setDestination] = useState([{latitude: 25.037998, longitude: 121.431877}]);
  const [LPoints, setLPoints] = useState([]);
  const [NPoints, setNPoints] = useState("");
  const [Dis, setDis] = useState("");
  const [Time, setTime] = useState("");
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const{plan} = route.params;
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBPu_5Fi8_Ouvq88730tMcVbKe2v4wwvRg';
  const initialRegion = { latitude: chargerlat,
                          longitude: chargerlng,
                          latitudeDelta: 0.02922,
                          longitudeDelta: 0.01421,
                        };
  const initialMark = { latitude: chargerlat,
                          longitude: chargerlng,
                        };
  async function readData(){
    // console.log(plan);
    const newPoints=[];
    try {
      const querySnapshot = await db.collection("routes").doc(chargername).collection("plan").where("id", "==", plan).get();
      querySnapshot.forEach((doc)=>{
        const newPoint = {
          planlist: doc.data().route
        }
        newPoints.push(newPoint.planlist);
        // console.log(newPoints)
      });
      readList(newPoints[0])
      catchData(newPoints[0])
      catchLData(newPoints[0])
    }
    catch(e){console.log(e)}
  };

  async function readList(a){
    const newLPoints=[];
    const newNPoints=[];
    let name = "";
    try {
      a.forEach((doc)=>{
        let dlat = parseFloat(doc.pointlat);
        let dlng = parseFloat(doc.pointlng);
        let pointname = doc.pointname;
        const newLPoint={
          pointaddress: doc.pointaddress,
          pointname: pointname,
          pointlat: dlat,
          pointlng: dlng
        }
        newLPoints.push(newLPoint);
        newNPoints.push(pointname);
      })
      setLPoints(newLPoints);
      for(let i = 0; i < (newNPoints.length-1); i++){
        let a = i+1
        let b = a.toString()
        name+=b+"."+newNPoints[i]+"、"
      }
      let c = newNPoints.length.toString();
      name+=c+"."+newNPoints[newNPoints.length-1];
      setNPoints(name)
      console.log(LPoints);
    }//try
    catch(e){console.log(e);}
  }//readData
  async function catchData(b){
    const newCatches=[];
    try {
      b.forEach((doc)=>{
        let clat = parseFloat(doc.pointlat);
        let clng = parseFloat(doc.pointlng);
        const newCatch={
          latitude: clat,
          longitude: clng
        }
        newCatches.push(newCatch)
      })
      let waylength = newCatches.length-1;
      setCatches(newCatches.slice(0, waylength));
      setDestination(newCatches[waylength]);
      console.log(Catches);
    }//try
    catch(e){console.log(e);}
  }//catchData
  async function catchLData(c){
    const newLCatches=[];
    try {
      let count=0;
      c.forEach((doc)=>{
        count+=1
        let newcount = count.toString();
        const newLCatch={
          latitude: doc.pointlat,
          longitude: doc.pointlng,
          vname: doc.pointname,
          vcount: newcount
        }
        newLCatches.push(newLCatch)
      })
      setLCatches(newLCatches);
    }//try
    catch(e){console.log(e);}
  }//catchLData

  async function readData1(){
    // console.log(plan);
    const newPoints=[];
    try {
      const querySnapshot = await db.collection("routes").doc(chargername).collection("plan").where("id", "==", plan).get();
      querySnapshot.forEach((doc)=>{
        const newdis = {
          distances: doc.data().distance
        }
        setDis(newdis.distances)
        setTime(Math.round(parseFloat(newdis.distances)*1000/75))
      });
      setIsLoading(false);
    }
    catch(e){console.log(e)}
  };

  useEffect(()=>{
    readData();
    readData1();
  },[])
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={{fontSize: 30,left:15,fontWeight:'bold'}}>最終路線</Text>
        <TouchableOpacity style={styles.backbutton} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{top: 50, left:15}}>順序: {NPoints}</Text>
        <Text style={{top: 50, left:15}}>距離: {Dis} 公里</Text>
        <Text style={{top: 50, left:15}}>預估時間: {Time} 分鐘</Text>
        {!isLoading ?
            <MapView
            style={styles.mapStyle}
            initialRegion={initialRegion}
            >
              <MapView.Marker
                coordinate={initialMark}
                title={chargername}
                pinColor={'#005AB5'}
              />
              {LCatches.map((item, index) => (
                <MapView.Marker
                  key={index}
                  coordinate={{latitude: item.latitude,
                      longitude: item.longitude}}
                  title={item.vcount}
                  description={item.vname}
                >
                </MapView.Marker>
              ))}
              <MapViewDirections
                origin={initialMark}
                waypoints={Catches}
                destination={Destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="hotpink"
                mode="WALKING"
              />
          </MapView>
          :
          <ActivityIndicator color="fff" size="large" animating={isLoading} style={{top:400}} />
        }
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('finish',{
          id: id,
          chargername: chargername,
          chargerlat: chargerlat,
          chargerlng: chargerlng,
          planway: "系統推薦",
          plan: LPoints
        })}>
          <Text>結束路線規劃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    // alignItems: 'center'
  },
  TitleContainer: {
    top:45,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mapStyle: {
    top: 80,
    marginLeft: 10,
    width: 390,
    height: '75%'
  },
  button: {
    top: 90,
    margin: 4,
    padding: 4,
    backgroundColor: '#cceeff',
    borderWidth:3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:5,
    paddingBottom:5,
    
  },
  backbutton: {
    margin: 4,
    padding: 4,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:3,
  
  }
});
