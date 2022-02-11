import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import QRCode from 'react-native-qrcode-svg'


export default function MyTickets({route}) {
  const navigation = useNavigation();
  const [UTickets, setUTickets] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [qrcode, setqrcode] = useState('');
  const [docid, setdocid] = useState('');
  const [userid, setuserid] = useState('');
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function readUTData(){
    const newUTickets=[];
    try {
      const user_id = firebase.auth().currentUser.uid;
      setuserid(user_id);
      const querySnapshot = await db.collection("members").doc(user_id).collection("tickets").where("use", "==", false).get();
      querySnapshot.forEach((doc) => {
        let rdate = doc.data().time.toDate();
        let id = doc.id
        const newUTicket = {
          couponname: doc.data().name,
          description: doc.data().description,
          date: rdate,
          id: id
        }
        newUTickets.push(newUTicket);
      });//foreach
      setUTickets(newUTickets);
      if(newUTickets.length==0){
        Alert.alert('系統通知', 
            '您目前尚無可用優惠券，請趕快前往領取!',
            [
              { text: "確定" , onPress: () => navigation.goBack()}
            ]
        )
      }
    }//try
  catch(e){console.log(e);}
  }//readData

  useEffect(() => {
    readUTData();
  },[modalVisible]);

  function useTicket(name, id){
    setqrcode(name);
    setdocid(id);
    setmodalVisible(true);
  }
  async function completeTicket(){
    try {
      const docRef = await db.collection("members").doc(userid).collection("tickets").doc(docid).update({
        use: true,
      });
      console.log('successfully!');
      setmodalVisible(false);
    }
    catch(error){
      console.log(error.message);
    }
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>名稱: {item.couponname}</Text>
      <Text>內容: {item.description}</Text>
      <Text>兌換日期: {item.date.toDateString().slice(4, 15)} {item.date.toTimeString().slice(0, 5)}</Text>
      <TouchableOpacity style={styles.buttondelete} onPress={()=>useTicket(item.couponname, item.id)}>
        <Text>使用</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{planList}</Text> */}
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25,left:10}}>可使用優惠券</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={UTickets} 
        renderItem = {renderItem}
        keyExtractor={(item, i) => ""+i}
        style={{top: 50}}
      >
      </FlatList>
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <QRCode size={150} value={qrcode}></QRCode>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.buttonreturn} onPress={()=>setmodalVisible(false)}>
              <Text>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonreturn} onPress={()=>completeTicket()}>
              <Text>完成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }

});
