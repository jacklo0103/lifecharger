import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as FirebaseCore from 'expo-firebase-core';

export default function SignUp(props) {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function signUp(){
    try {
      const res = await firebase.auth()
        .createUserWithEmailAndPassword(email, password);
      res.user.updateProfile({displayName: displayName});
      const user_id = firebase.auth().currentUser.uid;
      const docRef = await db.collection("members").doc(user_id).set({
        name: displayName,
        email: email,
        point: 0,
        uid: user_id
      });
      console.log('User registered successfully!');
      navigation.navigate('SignIn')
      setDisplayName('');
      setEmail('');
      setPassword('');
      setMessage('');
    }
    catch(error){
      setMessage(error.message);
    }
  } 
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title style={{fontSize:24}}>會員註冊</Card.Title>
        <Card.Divider/>
        <View style={styles.form}>
          <TextInput
            style={styles.inputStyle}
            placeholder="姓名"
            value={displayName}
            onChangeText={text=>setDisplayName(text)}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="電子信箱"
            value={email}
            onChangeText={text=>setEmail(text)}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="密碼"
            value={password}
            onChangeText={text=>setPassword(text)}
            maxLength={15}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text>註冊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
            <Text>我已有帳號，我要登入</Text>
          </TouchableOpacity>
          <Text>{message}</Text>
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
});
