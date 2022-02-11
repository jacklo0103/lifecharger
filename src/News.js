import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Linking, LogBox} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';


export default function News() {
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
      const querySnapshot = await db.collection("news").get();
      querySnapshot.forEach((doc) => {
        let rdate = doc.data().time.toDate();
        const newHistory = {
          date: rdate,
          content: doc.data().content,
          title: doc.data().title
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
      
        <Text style={{ fontSize: 25, top: 15 }}>最新消息</Text>
      </View>
      <ScrollView style={{top: 80 }}>
        {chistorys.map((item, i)=>(
          <View style={{flexDirection: 'row'}} key={i}>
            <View style={styles.dateContainer}>
              <Text style={{fontSize: 20}}>{item.title}</Text>
              <Text>{item.content}</Text>
              <Text>{item.date.toDateString().slice(4, 15)} {item.date.toTimeString().slice(0, 5)}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleContainer: {
    flexDirection: 'row',
    position: "absolute",
    top: 25,
    alignItems: 'center',
  },
  dateContainer: {
    height: 80,
    width: 400,
    backgroundColor: '#E0FFFF',
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
