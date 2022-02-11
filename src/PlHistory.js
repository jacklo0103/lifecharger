import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {addPlanList, clearPlanList} from './store/actions';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';

export default function PlHistory({route}) {
  const navigation = useNavigation();
  const{did} = route.params;
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  console.log(did);
  const [LPoints, setLPoints] = useState([]);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
//   const{chargerlat} = route.params;
//   const{chargerlng} = route.params;
//   const{id} = route.params;
  const planList = useSelector(state => state.planList)
  // console.log(planList);

  const dispatch = useDispatch();

  function handleAddPlan(a){
    dispatch(addPlanList(a));
    
  }
  async function readData(){
    const newPoints=[];
    try {
      const querySnapshot = await db.collection("plhistory").where("sid", "==", did).get();
      querySnapshot.forEach((doc)=>{
        const newPoint = {
          planlist: doc.data().plan
        }
        newPoints.push(newPoint.planlist);
        // console.log(newPoints)
      });
      readList(newPoints[0]);
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
        handleAddPlan(newLPoint);
      })
      setLPoints(newLPoints);
    }//try
    catch(e){console.log(e);}
  }//readData

  async function back(){
    dispatch(clearPlanList())
    navigation.goBack();
  }//readData

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>順序: {index+1}</Text>
      <Text>名稱: {item.pointname}</Text>
      <Text>地址: {item.pointaddress}</Text>
    </View>
  );

  useEffect(()=>{
    readData();
  },[])

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{planList}</Text> */}
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25}}>行程紀錄</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={back}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={LPoints} 
          renderItem = {renderItem}
          keyExtractor={(item, index) => ""+index}
          style={{top: 50}}
        >
        </FlatList>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>您的出發地: {chargername}</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('replan',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
          })}>
            <Text>修改行程</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('hisfinroute',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
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
    width:50
  },
  buttonreturn: {
    margin: 4,
    padding: 4,
    backgroundColor: '#ffd2d2',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:50
  },
  button: {
    margin: 4,
    padding: 10,
    backgroundColor: '#64b8de',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:130,
    marginBottom:15,
  },
  cardContainer: {
    width: 400,
    height: 100,
    margin: 5,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth:1,
  },
});
