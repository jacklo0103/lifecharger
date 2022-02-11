import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, LogBox, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import { Fontisto } from '@expo/vector-icons';

export default function Profile() {
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
      const querySnapshot = await db.collection("members").where("uid", "==", user_id).get();
      querySnapshot.forEach((doc) => {
        const newHistory = {
          name: doc.data().name,
          account: doc.data().email,
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
      <SafeAreaView style={styles.container}>
        <View style={{top: 100}}>
          <Fontisto name="person" size={200} color="black" />
        </View>
        {chistorys.map((item, i)=>(
          <View style={{top: 110, width: '100%'}}key={i}>
            <View style={{ borderColor: "#ccc", borderBottomWidth: 1}}>
              <Text style={{fontSize: 30 }}>姓名: {item.name}</Text>
            </View>
            <View style={{borderColor: "#ccc", borderBottomWidth: 1}}>
              <Text style={{fontSize: 30}}>帳號: {item.account}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', borderColor: "#ccc", borderBottomWidth: 1}}>
              <Text style={{fontSize: 30}}>點數: {item.points}</Text>
              <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate("phistory")}>
                <Text>查看明細</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', borderColor: "#ccc", borderBottomWidth: 1}}>
              <Text style={{fontSize: 30}}>我的優惠券</Text>
              <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate("mytickets")}>
                <Text>前往查看</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View>
          <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
            <Text>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    alignItems: 'center',
  },
  backbutton: {
    padding: 4,
    top: 120,
    width: 100,
    height: 35,
    backgroundColor: '#0080FF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonconfirm: {
    backgroundColor: '#cceeff',
    alignItems: 'center',
    borderRadius: 9,
    borderWidth:3,
    width:90,
    padding:6,
    margin:2,
    fontWeight:'bold',
    borderColor:'#64b8de',
  },
});
