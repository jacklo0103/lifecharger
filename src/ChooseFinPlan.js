import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';


export default function ChooseFinPlan({route}) {
  const navigation = useNavigation();
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const{id} = route.params;
  const{type} = route.params;
  const [LPoints, setLPoints] = useState([]);
  const [Dis, setDis] = useState("");
  const [Time, setTime] = useState("");
  async function readData(){
    // console.log(plan);
    const newPoints=[];
    try {
      const querySnapshot = await db.collection("recroutes").doc(chargername).collection("plan").where("type", "==", type).get();
      querySnapshot.forEach((doc)=>{
        const newPoint = {
          planlist: doc.data().plan
        }
        newPoints.push(newPoint.planlist);
        // console.log(newPoints)
      });
      readList(newPoints[0])
    }
    catch(e){console.log(e)}
  };

  async function readList(a){
    const newLPoints=[];
    try {
      a.forEach((doc)=>{
        let dlat = parseFloat(doc.pointlat);
        let dlng = parseFloat(doc.pointlng);
        const newLPoint={
          pointaddress: doc.pointaddress,
          pointname: doc.pointname,
          pointlat: dlat,
          pointlng: dlng
        }
        newLPoints.push(newLPoint)
      })
      setLPoints(newLPoints);
    }//try
    catch(e){console.log(e);}
  }//readData
  async function readData1(){
    try {
      const querySnapshot = await db.collection("recroutes").doc(chargername).collection("plan").where("type", "==", type).get();
      querySnapshot.forEach((doc)=>{
        const newdis = {
          distances: doc.data().distance
        }
        setDis(newdis.distances)
        setTime(Math.round(parseFloat(newdis.distances)*1000/75))
      });
    }
    catch(e){console.log(e)}
  };

  useEffect(()=>{
    readData();
    readData1()
  },[])

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>順序: {index+1}</Text>
      <Text>名稱: {item.pointname}</Text>
      <Text>地址: {item.pointaddress}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{planList}</Text> */}
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25,left:10}}>我的行程</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={LPoints} 
          renderItem = {renderItem}
          keyExtractor={(item, i) => ""+i}
          style={{top: 50}}
        >
        </FlatList>
        <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>距離: {Dis}公里</Text>
        <Text style={{fontSize: 20}}>預估時間: {Time}分鐘</Text>
          <Text style={{fontSize: 20}}>您的出發地: {chargername}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.couponbutton} onPress={() => navigation.navigate('fincoupon',{
            chargername: chargername
          })}>
              <Text>查看已領取優惠券</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('choosefinroute',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id,
              type: type
          })}>
            <Text>前往路線規劃</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
  },
  TitleContainer: {
    flexDirection: 'row',
    top:45,
    justifyContent: 'space-between'
  },
  buttondelete: {
    margin: 4,
    padding: 4,
    backgroundColor: '#ffd2d2',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:50,
    left:150
  },
  buttonreturn: {
    margin: 4,
    padding: 4,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:50,
    borderColor:'#64b8de',
    borderWidth:3
  },
  button: {
    margin: 4,
    padding: 10,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:130,
    marginBottom:15,
    borderColor:'#64b8de',
    borderWidth:3
  },
  cardContainer: {
    width: 400,
    height: 100,
    margin: 5,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth:1,
    paddingLeft:10
  },
  couponbutton: {
    margin: 4,
    padding: 10,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:150,
    marginBottom:15,
    borderColor:'#64b8de',
    borderWidth:3
  },
});
