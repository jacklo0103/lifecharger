import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import {AuthContext} from './src/account/AuthContext';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducer from './src/store/reducer';
import Home from './src/Home';
import Schedule from './src/Schedule';
import Member from './src/Member';
import News from './src/News';
import SignUp from './src/SignUp';
import SignIn from './src/SignIn';
import Preconfirm from './src/Preconfirm';
import Profile from './src/Profile';
import Chistory from './src/Chistory';
import Phistory from './src/Phistory';
import Prchistory from './src/Prchistory';
import Cancel from './src/Cancel';
import FinPlan from './src/FinPlan';
import FinRoute from './src/FinRoute';
import FinCoupon from './src/FinCoupon';
import Finish from './src/Finish';
import PlHistory from './src/PlHistory';
import HisFinRoute from './src/HisFinRoute';
import RePlan from './src/RePlan';
import ReSchedule from './src/ReSchedule';
import RecFinRoute from './src/RecFinRoute';
import ChooseFinRoute from './src/ChooseFinRoute';
import ChooseFinPlan from './src/ChooseFinPlan';
import PlanCoupon from './src/PlanCoupon';
import PointChange from './src/PointChange';
import MyTickets from './src/MyTickets';
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const PlanStack = createStackNavigator();
const MemStack = createStackNavigator();
const NewsStack = createStackNavigator();
const LogStack = createStackNavigator();

const store = createStore(reducer);
function HomeScreen() {
  return(
    <HomeStack.Navigator>
      <HomeStack.Screen name="home" component={Home} options={{headerShown: false}}/>
      <HomeStack.Screen name="preconfirm" component={Preconfirm} options={{headerShown: false}}/>
    </HomeStack.Navigator>
  )
}
function PlanScreen() {
  return(
    <PlanStack.Navigator>
      <PlanStack.Screen name="prchistory" component={Prchistory} options={{headerShown: false}}/>
      <PlanStack.Screen name="schedule" component={Schedule} options={{headerShown: false}}/>
      <PlanStack.Screen name="cancel" component={Cancel} options={{headerShown: false}}/>
      <PlanStack.Screen name="finplan" component={FinPlan} options={{headerShown: false}}/>
      <PlanStack.Screen name="fincoupon" component={FinCoupon} options={{headerShown: false}}/>
      <PlanStack.Screen name="finroute" component={FinRoute} options={{headerShown: false}}/>
      <PlanStack.Screen name="finish" component={Finish} options={{headerShown: false}}/>
      <PlanStack.Screen name="recfinroute" component={RecFinRoute} options={{headerShown: false}}/>
      <PlanStack.Screen name="choosefinplan" component={ChooseFinPlan} options={{headerShown: false}}/>
      <PlanStack.Screen name="choosefinroute" component={ChooseFinRoute} options={{headerShown: false}}/>
    </PlanStack.Navigator>
  )
}
function MemScreen() {
  return(
    <MemStack.Navigator>
      <MemStack.Screen name="member" component={Member} options={{headerShown: false}}/>
      <MemStack.Screen name="profile" component={Profile} options={{headerShown: false}}/>
      <MemStack.Screen name="chistory" component={Chistory} options={{headerShown: false}}/>
      <MemStack.Screen name="pointchange" component={PointChange} options={{headerShown: false}}/>
      <MemStack.Screen name="phistory" component={Phistory} options={{headerShown: false}}/>
      <MemStack.Screen name="plhistory" component={PlHistory} options={{headerShown: false}}/>
      <MemStack.Screen name="hisfinroute" component={HisFinRoute} options={{headerShown: false}}/>
      <MemStack.Screen name="replan" component={RePlan} options={{headerShown: false}}/>
      <MemStack.Screen name="reschedule" component={ReSchedule} options={{headerShown: false}}/>
      <MemStack.Screen name="plancoupon" component={PlanCoupon} options={{headerShown: false}}/>
      <MemStack.Screen name="mytickets" component={MyTickets} options={{headerShown: false}}/>
    </MemStack.Navigator>
  )
}
function NewsScreen() {
  return(
    <NewsStack.Navigator>
      <NewsStack.Screen name="news" component={News} options={{headerShown: false}}/>
    </NewsStack.Navigator>
  )
}
export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthContext.Provider value={{isSignedIn: isSignedIn, setStatus: setIsSignedIn}}>
          {isSignedIn?(
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === '前往充電') {
                    iconName = 'map';
                  }
                  else if (route.name === '行程規劃') {
                    iconName = 'event-note';
                  }
                  else if (route.name === '會員中心') {
                    iconName = 'account-circle';
                  }
                  else if (route.name === '最新消息') {
                    iconName = 'message';
                  }
                  return <MaterialIcons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: '#33CCFF',
                inactiveTintColor: 'gray',
              }}
            >
              <>
              <Tab.Screen name="前往充電" component={HomeScreen} />
              <Tab.Screen name="行程規劃" component={PlanScreen} />
              <Tab.Screen name="最新消息" component={NewsScreen} />
              <Tab.Screen name="會員中心" component={MemScreen} />
              </>
            </Tab.Navigator>
          ):(
            <LogStack.Navigator>
              <LogStack.Screen name="SignIn" component={SignIn} options={{headerShown: false}}/>
              <LogStack.Screen name="SignUp" component={SignUp} options={{headerShown: false}}/>
            </LogStack.Navigator>
          )}
          
        </AuthContext.Provider>
      </NavigationContainer>
    </Provider>
    
  );
  
  
}
