import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, LogBox, ScrollView, Alert, Platform, Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as FirebaseCore from 'expo-firebase-core';
import { useDispatch } from 'react-redux';
import {addPlanList, addCoupon} from './store/actions';
import { Foundation, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; 


export default function Schedule({route}) {
  const navigation = useNavigation();
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const{id} = route.params;
  LogBox.ignoreLogs(['Setting a timer']);
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS);
  }
  const db = firebase.firestore();
  const [Cafes, setCafes] = useState([]);
  const [Ress, setRess] = useState([]);
  const [Conveniences, setConveniences] = useState([]);
  const [Parks, setParks] = useState([]);
  const dispatch = useDispatch();


  async function readCafe(){
    const newCafes=[];
    try {
      const querySnapshot = await db.collection("chargers").doc(chargername).collection("neighbor").where("type", "==", "cafe").get();
      querySnapshot.forEach((doc)=>{
        const newCafe = {
          viewname: doc.data().name,
          viewaddress: doc.data().viewaddress,
          viewphone: doc.data().viewphone,
          viewlat: doc.data().vlat,
          viewlng: doc.data().vlng,
          viewid: doc.data().id,
          viewrating: doc.data().rating,
          viewworkdays: doc.data().workdays,
        }
        newCafes.push(newCafe);
      });
      setCafes(newCafes);
    }
    catch(e){console.log(e)}
  }
  async function readRes(){
    const newRess=[];
    try {
      const querySnapshot = await db.collection("chargers").doc(chargername).collection("neighbor").where("type", "==", "restaurant").get();
      querySnapshot.forEach((doc)=>{
        const newRes = {
          viewname: doc.data().name,
          viewaddress: doc.data().viewaddress,
          viewphone: doc.data().viewphone,
          viewlat: doc.data().vlat,
          viewlng: doc.data().vlng,
          viewid: doc.data().id,
          viewrating: doc.data().rating,
          viewworkdays: doc.data().workdays,
        }
        newRess.push(newRes);
      });
      setRess(newRess);
    }
    catch(e){console.log(e)}
  }
  async function readConvenience(){
    const newConveniences=[];
    try {
      const querySnapshot = await db.collection("chargers").doc(chargername).collection("neighbor").where("type", "==", "convenience_store").get();
      querySnapshot.forEach((doc)=>{
        const newConvenience = {
          viewname: doc.data().name,
          viewaddress: doc.data().viewaddress,
          viewphone: doc.data().viewphone,
          viewlat: doc.data().vlat,
          viewlng: doc.data().vlng,
          viewid: doc.data().id,
          viewrating: doc.data().rating,
        }
        newConveniences.push(newConvenience);
      });
      setConveniences(newConveniences);
    }
    catch(e){console.log(e)}
  }
  async function readParks(){
    const newParks=[];
    try {
      const querySnapshot = await db.collection("chargers").doc(chargername).collection("neighbor").where("type", "==", "park").get();
      querySnapshot.forEach((doc)=>{
        const newPark = {
          viewname: doc.data().name,
          viewaddress: doc.data().viewaddress,
          viewphone: doc.data().viewphone,
          viewlat: doc.data().vlat,
          viewlng: doc.data().vlng,
          viewid: doc.data().id,
          viewrating: doc.data().rating,
        }
        newParks.push(newPark);
      });
      setParks(newParks);
    }
    catch(e){console.log(e)}
  }
  useEffect(()=>{
    readCafe();
    readConvenience();
    readParks();
    readRes();
  },[])


  function handleAddPlan(vname, vlat, vlng, viewaddress, viewid){
    const viewpoint = {
        pointname: vname,
        pointlat: vlat,
        pointlng: vlng,
        pointaddress: viewaddress,
        pointid: viewid
      };
    dispatch(addPlanList(viewpoint));
    alert("該地點已成功加入您的行程中!")
    console.log(viewpoint)
  }

  function handleCouponAddPlan(vname, vlat, vlng, viewaddress, viewid, couponname, description){
    const viewpoint = {
        pointname: vname,
        pointlat: vlat,
        pointlng: vlng,
        pointaddress: viewaddress,
        pointid: viewid
    };
    const coupon = {
      couponname:  couponname,
      description: description,
      use: 'false'
    }
    dispatch(addPlanList(viewpoint));
    dispatch(addCoupon(coupon));
    alert("已成功領取優惠券並將該地點加入您的行程中!")
  }

  async function handleAlert(vname, vlat, vlng, viewaddress, viewid){
    try {
      const querySnapshot = await db.collection("coupons").where("name", "==", vname).where("type", "==", "every").get();
      let newAds = [];
      querySnapshot.forEach((doc)=>{
        let couponname = doc.data().name;
        let description = doc.data().description
        const newAd = {
          couponname: couponname,
          description: description
        }
        newAds.push(newAd)
      });
      console.log(newAds.length);
      if(newAds.length==1){
        Alert.alert('優惠資訊', 
          newAds[0]['description'],
          [
            {
              text: "取消",
              style: "cancel"
            },
            { text: "領取並加入行程", onPress: () => handleCouponAddPlan(vname, vlat, vlng, viewaddress, viewid, newAds[0]['couponname'], newAds[0]['description']) }
          ],
          { cancelable: false }
        )
      }
      else if(newAds.length==0){
        Alert.alert('優惠資訊', 
          '目前該店家尚未提供優惠券',
          [
            {
              text: "取消",
              style: "cancel"
            }
          ],
          { cancelable: false }
        )
      }
    }
    catch(e){console.log(e)}
  }

  function tonavi(lat, lng, name){
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo: 0,0?q='
    });
    const latLng = `${lat},${lng}`
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${label}`
    });
    Linking.openURL(url)
  }
  
  function tophone(phone){
    Linking.openURL(`tel:${phone}`)
  }

  async function handleWorkdaysAlert(workdays){
    let a = workdays[0];
    let b = workdays[1];
    let c = workdays[2];
    let d = workdays[3];
    let e = workdays[4];
    let f = workdays[5];
    let g = workdays[6];
    let h = a+'\n'+b+'\n'+c+'\n'+d+'\n'+e+'\n'+f+'\n'+g
    Alert.alert('營業時間', 
          h,
          [
            {
              text: "取消",
              style: "cancel"
            }
          ],
          { cancelable: false }
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{top:50}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: 20, fontWeight:'bold',left:10 }}>推薦行程</Text>
          <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate('finplan',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id
          })}>
            <Text>確認行程</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate('choosefinplan',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id,
              type: '散心行程'
            })}>
              <Text>散心行程</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate('choosefinplan',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id,
              type: '美食行程'
            })}>
              <Text>美食行程</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonconfirm} onPress={() => navigation.navigate('choosefinplan',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id,
              type: '放鬆行程'
            })}>
              <Text>放鬆行程</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Text style={{ fontSize: 20,left:10,fontWeight:'bold'}}>咖啡廳</Text>
        <ScrollView horizontal={true}>
          {Cafes.map((item, i)=>(
            <View style={styles.cardContainer} key={i}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>名稱: {item.viewname}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.littlebutton} onPress={()=>handleWorkdaysAlert(item.viewworkdays)}>
                    <MaterialCommunityIcons name="information-variant" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.littlebutton} onPress={()=>handleAlert(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                    <Foundation name="ticket" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>電話: {item.viewphone}</Text>
                <TouchableOpacity style={styles.littlebutton} onPress={()=>tophone(item.viewphone)}>
                  <AntDesign name="phone" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <Text>地址: {item.viewaddress}</Text>
              <Text>評價: {item.viewrating}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.button} onPress={()=>tonavi(item.viewlat, item.viewlng, item.viewname)}>
                  <Text>導航</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>handleAddPlan(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                  <Text>加入</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <Text style={{ fontSize: 20,left:10,fontWeight:'bold'}}>餐廳</Text>
        <ScrollView horizontal={true}>
          {Ress.map((item, i)=>(
            <View style={styles.cardContainer} key={i}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>名稱: {item.viewname}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.littlebutton} onPress={()=>handleWorkdaysAlert(item.viewworkdays)}>
                    <MaterialCommunityIcons name="information-variant" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.littlebutton} onPress={()=>handleAlert(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                    <Foundation name="ticket" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>電話: {item.viewphone}</Text>
                <TouchableOpacity style={styles.littlebutton} onPress={()=>tophone(item.viewphone)}>
                  <AntDesign name="phone" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <Text>地址: {item.viewaddress}</Text>
              <Text>評價: {item.viewrating}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.button} onPress={()=>tonavi(item.viewlat, item.viewlng, item.viewname)}>
                  <Text>導航</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>handleAddPlan(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                  <Text>加入</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <Text style={{ fontSize: 20,left:10,fontWeight:'bold'}}>便利商店</Text>
        <ScrollView horizontal={true}>
          {Conveniences.map((item, i)=>(
            <View style={styles.cardContainerCon} key={i}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>名稱: {item.viewname}</Text>
                <TouchableOpacity style={styles.littlebutton} onPress={()=>handleAlert(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                  <Foundation name="ticket" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>電話: {item.viewphone}</Text>
              </View>
              <Text>地址: {item.viewaddress}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.button} onPress={()=>tonavi(item.viewlat, item.viewlng, item.viewname)}>
                  <Text>導航</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>handleAddPlan(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                  <Text>加入</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <Text style={{ fontSize: 20,left:10,fontWeight:'bold'}}>公園</Text>
        <ScrollView horizontal={true}>
          {Parks.map((item, i)=>(
            <View style={styles.cardContainer1} key={i}>
              <Text>名稱: {item.viewname}</Text>
              <Text>地址: {item.viewaddress}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.button} onPress={()=>tonavi(item.viewlat, item.viewlng, item.viewname)}>
                  <Text>導航</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>handleAddPlan(item.viewname, item.viewlat, item.viewlng, item.viewaddress, item.viewid)}>
                  <Text>加入</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    alignItems: 'center',
  },
  TitleContainer: {
    position: "absolute",
    top: 10,
    alignItems: 'center',
  },
  cardContainer: {
    width: 350,
    height: 165,
    margin: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  cardContainer1: {
    width: 300,
    height: 80,
    margin: 5,
    backgroundColor: '#fff'
  },
  cardContainerCon: {
    width: 350,
    height: 120,
    margin: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 4,
    padding: 4,
    width: 100,
    backgroundColor: '#CCEEFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  littlebutton: {
    margin: 1,
    padding: 4,
    width: 30,
    backgroundColor: '#CCEEFF',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonconfirm: {
    backgroundColor: '#cceeff',
    alignItems: 'center',
    borderRadius: 9,
    borderWidth:3,
    width:90,
    padding:5,
    fontWeight:'bold',
    borderColor:'#64b8de',
  },
});
