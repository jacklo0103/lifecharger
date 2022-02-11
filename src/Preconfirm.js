import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';

export default function Preconfirm({route}) {
  const navigation = useNavigation();
  const{name} = route.params;
  const{lat} = route.params;
  const{lng} = route.params;
  const [displayName, setDisplayName] = useState(name);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function reserve(){
    try {
      const user_id = firebase.auth().currentUser.uid;
      const docRef = await db.collection("history").doc().set({
        charger: displayName,
        date: date,
        uid: user_id,
        lat: lat,
        lng: lng,
        done: false
      });
      console.log('successfully!');
      alert("您已預約成功，請前往行程規畫進行查看!!")
      navigation.navigate('home');
    }
    catch(error){
      console.log(error.message);
    }
  }
  function onChange(event, selectedDate){
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(date);
  };

  function showMode(currentMode){
    setShow(true);
    setMode(currentMode);
  };

  function showDatepicker(){
    showMode('date');
  };

  function showTimepicker(){
    showMode('time');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title>預約確認</Card.Title>
        <Card.Divider/>
        <View style={styles.form}>
          <Text style={styles.inputStyle}>{displayName}</Text>
          <Text style={styles.inputStyle}>{date.toDateString()} {date.toLocaleTimeString().slice(0,9)}</Text>
          <View style={styles.picker}>
            <TouchableOpacity style={styles.button} onPress={showDatepicker}>
              <Text>選日期</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={showTimepicker}>
              <Text>選時間</Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <View></View>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
            <Text>取消預約</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={reserve}>
            <Text>確定預約</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
    width:350
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  button: {
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#E0FFFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // pickerbtn: {
  //   margin: 10,
  //   padding: 10,
  //   paddingLeft: 20,
  //   paddingRight: 20,
  //   backgroundColor: '#0080FF',
  //   borderRadius: 9,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
});
