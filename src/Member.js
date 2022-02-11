import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import { useDispatch } from 'react-redux';
import {clearPlanList} from './store/actions';
import {AuthContext} from './account/AuthContext';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';


export default function Member() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  async function signOut(){
    try{
      dispatch(clearPlanList());
      await firebase.auth().signOut();
      console.log('User signed out successfully!');
      authContext.setStatus(false);
    }
    catch(error){
      console.log(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ViewContent}>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('profile')}>
            <MaterialIcons name="person-outline" size={125} color="black" />
            <Text style={{ fontSize: 20}}>個人資料</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('chistory')}>
            <Feather name="battery-charging" size={125} color="black" />
            <Text style={{ fontSize: 20}}>充電紀錄</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.ViewContent}>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('pointchange')}>
            <Feather name="award" size={125} color="black" />
            <Text style={{ fontSize: 20,paddingTop:20}}>兌換中心</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={signOut}>
            <Entypo name="log-out" size={125} color="black" />
            <Text style={{ fontSize: 20,paddingTop:20}}>登出</Text>
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
    justifyContent: 'center',
  },
  ViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    padding: 30,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
