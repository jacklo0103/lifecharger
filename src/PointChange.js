import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, LogBox, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';


export default function PointChange() {
  const navigation = useNavigation();
  LogBox.ignoreLogs(['Setting a timer']);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const [refresh, setrefresh] = useState(false);
  const [UPoints, setUPoints] = useState('');
  const [OTickets, setOTickets] = useState([]);
  async function readUPData(){
    const newUPoints=[];
    try {
      const user_id = firebase.auth().currentUser.uid;
      const querySnapshot = await db.collection("members").where("uid", "==", user_id).get();
      querySnapshot.forEach((doc) => {
        let point = doc.data().point
        newUPoints.push(point);
      });//foreach
      setUPoints(newUPoints[0]);
      console.log(newUPoints[0])
    }//try
  catch(e){console.log(e);}
  }//readData

  async function readTData(){
    const newOTickets=[];
    try {
      const user_id = firebase.auth().currentUser.uid;
      console.log(user_id);
      const querySnapshot = await db.collection("coupons").where("type", "==", "own").get();
      querySnapshot.forEach((doc) => {
        const newOTicket = {
          couponname: doc.data().name,
          description: doc.data().description,
          point: doc.data().point
        }
        newOTickets.push(newOTicket);
      });//foreach
      setOTickets(newOTickets);
    }//try
  catch(e){console.log(e);}
  }//readData
  useEffect(() => {
      readUPData();
      readTData();
    },[refresh]);
  
  async function ChangeTicket(point, couponname, description){
    const user_id = firebase.auth().currentUser.uid;
    let userpoint = parseInt(UPoints)
    let rpoint = parseInt(point);
    let date = new Date();
    if(rpoint<userpoint){
      try {
        const docRef = await db.collection("members").doc(user_id).update({
          point: userpoint-rpoint
        });
        const docRef1 = await db.collection("phistory").doc().set({
          point: 0-rpoint,
          title: "優惠兌換",
          uid: user_id,
          time: date
        });
        const docRef2 = await db.collection("members").doc(user_id).collection("tickets").doc().set({
          description: description,
          name: couponname,
          time: date,
          use: false
        });
        console.log('successfully!');
        alert("您已成功兌換，請至會員中心查看!!")
        update()
      }
      catch(error){
        console.log(error.message);
      }
    }
    else{
      alert("您的點數不足!")
    }
    
  }

  function update(){
    if(refresh==true){
      setrefresh(false);
    }
    else{
      setrefresh(true);
    }
  }
  
  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>名稱: {item.couponname}</Text>
      <Text>內容: {item.description}</Text>
      <Text>點數: {item.point}</Text>
      <TouchableOpacity style={styles.buttondelete} onPress={()=>ChangeTicket(item.point, item.couponname, item.description)}>
        <Text>兌換</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25,left:10}}>兌換中心</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={OTickets} 
          renderItem = {renderItem}
          keyExtractor={(item, i) => ""+i}
          style={{top: 50}}
        >
        </FlatList>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>剩餘點數: {UPoints}</Text>
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
});
