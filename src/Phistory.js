import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, LogBox} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';


export default function Phistory() {
  const navigation = useNavigation();
  LogBox.ignoreLogs(['Setting a timer']);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const [chistorys, setHistory] = useState([]);
  async function readData(){
    const newHistorys=[];
    try {
      const user_id = firebase.auth().currentUser.uid;
      console.log(user_id);
      const querySnapshot = await db.collection("phistory").where("uid", "==", user_id).orderBy("time", "desc").get();
      querySnapshot.forEach((doc) => {
        let rdate = doc.data().time.toDate();
        console.log(rdate);
        const newHistory = {
          date: rdate,
          title: doc.data().title,
          points: doc.data().point
        }
        newHistorys.push(newHistory);
        console.log(newHistorys);
      });//foreach
      setHistory(newHistorys);
    }//try
  catch(e){console.log(e);}
  }//readData
  useEffect(() => {
      readData();
    },[]);

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 25, top: 10 }}>點數紀錄</Text>
      </View>
      <ScrollView style={{top: 70}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.dateContainer}>
            <Text>日期</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text>原因</Text>
          </View>
          <View style={styles.naviContainer}>
            <Text>點數</Text>
          </View>
        </View>
        {chistorys.map((item, i)=>(
          <View style={{flexDirection: 'row'}} key={i}>
            <View style={styles.dateContainer} >
              <Text>{item.date.toDateString().slice(4, 15)}</Text>
              <Text>{item.date.toTimeString().slice(0, 5)}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text>{item.title}</Text>
            </View>
            <View style={styles.naviContainer}>
            <Text>{item.points}</Text>
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
    backgroundColor: '#66B3FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  TitleContainer: {
    flexDirection: 'row',
    position: "absolute",
    top: 25,
    alignItems: 'center',
  },
  dateContainer: {
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'powderblue',
    borderColor: "black",
    borderBottomWidth: 1
  },
  nameContainer: {
    width: 170,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    borderColor: "black",
    borderBottomWidth: 1
  },
  naviContainer: {
    width: 50,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'steelblue',
    borderColor: "black",
    borderBottomWidth: 1
  },
  button: {
    margin: 4,
    padding: 4,
    backgroundColor: '#0080FF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backbutton: {
    padding: 4,
    top: 10,
    backgroundColor: '#0080FF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
