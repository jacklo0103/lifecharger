import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {delPlanList} from './store/actions';


export default function FinPlan({route}) {
  const navigation = useNavigation();
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const{id} = route.params;
  const planList = useSelector(state => state.planList)
  console.log(planList);

  const dispatch = useDispatch();

  function handleDelPlan(planIndex){
    console.log(planIndex)
    dispatch(delPlanList(planIndex));
  }

  function getroute(){
    const route=[];
    try {
      planList.forEach((doc)=>{
        let pointid = doc.pointid;
        route.push(pointid)
      })
      const sortroute = route.sort(function(a, b){return a - b});
      let plan='';
      let i;
      for(i=0; i<(sortroute.length-1); i++){
        plan+=sortroute[i]+'-';
      }
      plan+=sortroute[sortroute.length-1];
      console.log(plan);
      navigation.navigate('recfinroute',{
        chargername: chargername,
        chargerlat: chargerlat,
        chargerlng: chargerlng,
        id: id,
        plan: plan
      })
    }//try
    catch(e){console.log(e);}
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>順序: {index+1}</Text>
      <Text>名稱: {item.pointname}</Text>
      <Text>地址: {item.pointaddress}</Text>
      <TouchableOpacity style={styles.buttondelete} onPress={()=>handleDelPlan(index)}>
        <Text>刪除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{planList}</Text> */}
      <View style={styles.TitleContainer}>
        <Text style={{ fontSize: 25,left:10}}>我的行程</Text>
        <TouchableOpacity style={styles.buttonreturn} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={planList} 
          renderItem = {renderItem}
          keyExtractor={(item, i) => ""+i}
          style={{top: 50}}
        >
        </FlatList>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.couponbutton} onPress={() => navigation.navigate('fincoupon',{
            chargername: chargername
          })}>
              <Text>查看已領取優惠券</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>您的出發地: {chargername}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.button} onPress={getroute}>
            <Text>推薦路線規劃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('finroute',{
              chargername: chargername,
              chargerlat: chargerlat,
              chargerlng: chargerlng,
              id: id
          })}>
            <Text>前往路線規劃</Text>
          </TouchableOpacity>
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
  couponbutton: {
    margin: 4,
    padding: 10,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width:150,
    marginBottom:15,
    borderColor:'#64b8de',
    borderWidth:3
  },
});
