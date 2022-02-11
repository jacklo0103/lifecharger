import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, TouchableOpacity} from 'react-native';
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {clearPlanList, clearCoupon} from './store/actions';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';

export default function Finish({route}) {
  const navigation = useNavigation();
  const{id} = route.params;
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const{planway} = route.params;
  const{plan} = route.params;
  const couponList = useSelector(state => state.couponList)
  const dispatch = useDispatch();
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function handleclear(){
    try {
      const docRef = await db.collection("history").doc(id).update({
        done: true
      });
      const docRef1 = await db.collection("plhistory").doc().set({
        chargername:chargername,
        chargerlat:chargerlat,
        chargerlng:chargerlng,
        plan: plan,
        sid: id,
        planway: planway,
        coupons: couponList
      });
      console.log('successfully!');
      alert("您已完成此次充電行程!!")
      dispatch(clearPlanList())
      dispatch(clearCoupon())
      navigation.navigate('prchistory');
    }
    catch(error){
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title>您確定完成此次行程規劃嗎?</Card.Title>
        <Card.Divider/>
        <View style={styles.form}>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
            <Text>返回</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleclear}>
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
    backgroundColor: '#cceeff',
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
    backgroundColor: '#cceeff',
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
