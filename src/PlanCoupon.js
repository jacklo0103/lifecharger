import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Modal, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import QRCode from 'react-native-qrcode-svg'

export default function PlanCoupon({route}) {
  const navigation = useNavigation();
  const{chargername} = route.params;
  const{did} = route.params;
  const [LCoupons, setLCoupons] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [qrcode, setqrcode] = useState('');
  const [ticketindex, setticketindex] = useState('');
  const [docid, setdocid] = useState('');
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  async function readData(){
    const newCoupons=[];
    try {
      const querySnapshot = await db.collection("plhistory").where("sid", "==", did).get();
      querySnapshot.forEach((doc)=>{
        let id = doc.id;
        setdocid(id);
        const newCoupon = {
          couponlist: doc.data().coupons
        }
        newCoupons.push(newCoupon.couponlist);
        // console.log(newPoints)
      });
      readList(newCoupons[0]);
    }
    catch(e){console.log(e)}
  };

  async function readList(a){
    const newLCoupons=[];
    try {
      a.forEach((doc)=>{
        const newLCoupon={
          couponname: doc.couponname,
          description: doc.description,
          use: doc.use
        }
        newLCoupons.push(newLCoupon)
      })
      if(newLCoupons.length==0){
        Alert.alert('系統通知', 
            '此行程目前已無可用優惠券!',
            [
              { text: "確定" , onPress: () => navigation.goBack()}
            ]
        )
      }
      setLCoupons(newLCoupons);
    }//try
    catch(e){console.log(e);}
  }//readData

  useEffect(() => {
    readData();
  },[]);

  function useTicket(name, i){
    setqrcode(name);
    setticketindex(i);
    setmodalVisible(true);
  }
  async function completeTicket(){
    try {
      LCoupons.splice([ticketindex],1);
      const docRef2 = await db.collection("plhistory").doc(docid).update({
        coupons: LCoupons,
      });
      console.log('successfully!');
      setmodalVisible(false);
      if(LCoupons.length==0){
        Alert.alert('系統通知', 
            '此行程目前已無可用優惠券!',
            [
              { text: "確定" , onPress: () => navigation.goBack()}
            ]
        )
      }
    }
    catch(error){
      console.log(error.message);
    }
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>名稱: {item.couponname}</Text>
      <Text>內容: {item.description}</Text>
      <TouchableOpacity style={styles.buttondelete} onPress={()=>useTicket(item.couponname, index)}>
        <Text>使用</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{planList}</Text> */}
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25,left:10}}>我的優惠券</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={LCoupons} 
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
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>您的出發地: {chargername}</Text>
        </View>
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
