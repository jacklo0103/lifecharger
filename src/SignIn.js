import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements'
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import {AuthContext} from './account/AuthContext'


export default function SignIn(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const authContext = useContext(AuthContext);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  async function signIn(){
    try {
      const res= firebase.auth()
        .signInWithEmailAndPassword(email, password)
          .then(()=>{
            console.log('User login successfully!');
            setEmail('');
            setPassword('');
            setMessage('');
            authContext.setStatus(true);
          })
          .catch(error => {
            setMessage(error.message);
          })
    }
    catch(error){
      setMessage(error.message);
    } 
  };
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title style={{fontSize:24}}>會員登入</Card.Title>
        <Card.Divider/>
        <View style={styles.form}>
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
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text>登入</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
            <Text>我還沒有帳號!</Text>
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
    width:350,
    borderRadius:10
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
