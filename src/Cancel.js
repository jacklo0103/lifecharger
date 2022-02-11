import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';

export default function Cancel({route}) {
  const navigation = useNavigation();
  const{id} = route.params;
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function cancel(){
    try {
      const docRef = await db.collection("history").doc(id).delete();
      console.log('successfully!');
      alert("您已成功取消本次預約!!")
      navigation.navigate('prchistory')
    }
    catch(error){
      console.log(error.message);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title>您是否要取消本次預約</Card.Title>
        <Card.Divider/>
        <View style={styles.form}>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
            <Text>返回</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={cancel}>
            <Text>確定</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#66B3FF',
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
    backgroundColor: '#0080FF',
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
