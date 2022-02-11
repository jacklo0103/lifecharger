import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {delCoupon} from './store/actions';


export default function FinCoupon({route}) {
  const navigation = useNavigation();
  const{chargername} = route.params;
  const couponList = useSelector(state => state.couponList)
  console.log(couponList);

  const dispatch = useDispatch();

  function handleDelCoupon(couponIndex){
    console.log(couponIndex)
    dispatch(delCoupon(couponIndex));
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text>名稱: {item.couponname}</Text>
      <Text>內容: {item.description}</Text>
      <TouchableOpacity style={styles.buttondelete} onPress={()=>handleDelCoupon(index)}>
        <Text>刪除</Text>
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
          data={couponList} 
          renderItem = {renderItem}
          keyExtractor={(item, i) => ""+i}
          style={{top: 50}}
        >
        </FlatList>
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
});
