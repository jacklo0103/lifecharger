import React, { useState, useEffect } from 'react';
import { AppLoading} from 'expo';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function FinRoute({route}) {
  const navigation = useNavigation();
  const{id} = route.params;
  const [Points, setPoints] = useState([]);
  const [Destination, setDestination] = useState([{latitude: 25.037998, longitude: 121.431877}]);
  const [LPoints, setLPoints] = useState([]);
  const [NPoints, setNPoints] = useState("");
  const{chargername} = route.params;
  const{chargerlat} = route.params;
  const{chargerlng} = route.params;
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBPu_5Fi8_Ouvq88730tMcVbKe2v4wwvRg';
  const planList = useSelector(state => state.planList)
  const initialRegion = { latitude: chargerlat,
                          longitude: chargerlng,
                          latitudeDelta: 0.02922,
                          longitudeDelta: 0.01421,
                        };
  const initialMark = { latitude: chargerlat,
                          longitude: chargerlng,
                        };
  async function readData(){
    const newPoints=[];
    try {
      planList.forEach((doc)=>{
        let dlat = parseFloat(doc.pointlat);
        let dlng = parseFloat(doc.pointlng);
        const newPoint={
          latitude: dlat,
          longitude: dlng
        }
        newPoints.push(newPoint)
      })
      let waylength = newPoints.length-1;
      setPoints(newPoints.slice(0, waylength));
      setDestination(newPoints[waylength]);
      // console.log('123')
      // console.log(newPoints[waylength]);
      // console.log(Destination)
    }//try
    catch(e){console.log(e);}
  }//readData
  async function readLData(){
    const newLPoints=[];
    const newNPoints=[];
    let name = "";
    try {
      let count=0;
      planList.forEach((doc)=>{
        count+=1
        let newcount = count.toString();
        let pointname = doc.pointname;
        const newLPoint={
          latitude: doc.pointlat,
          longitude: doc.pointlng,
          vname: pointname,
          vcount: newcount
        }
        newLPoints.push(newLPoint);
        newNPoints.push(pointname);
      })
      setLPoints(newLPoints);
      for(let i = 0; i < (newNPoints.length-1); i++){
        let a = i+1
        let b = a.toString()
        name+=b+"."+newNPoints[i]+"、"
      }
      let c = newNPoints.length.toString();
      name+=c+"."+newNPoints[newNPoints.length-1];
      setNPoints(name)
    }//try
    catch(e){console.log(e);}
  }//readLData
  useEffect(()=>{
    readData();
    readLData()
  },[])
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={{fontSize: 30,left:15,fontWeight:'bold'}}>最終路線</Text>
        <TouchableOpacity style={styles.backbutton} onPress={()=>navigation.goBack()}>
          <Text>返回</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{top: 50, left:15}}>順序: {NPoints}</Text>
        <MapView
          style={styles.mapStyle}
          initialRegion={initialRegion}
        >
            <MapView.Marker
              coordinate={initialMark}
              title={chargername}
              pinColor={'#005AB5'}
            />
            {LPoints.map((item, index) => (
              <MapView.Marker
                key={index}
                coordinate={{latitude: item.latitude,
                    longitude: item.longitude}}
                title={item.vcount}
                description={item.vname}
              >
              </MapView.Marker>
            ))}
            <MapViewDirections
              origin={initialMark}
              waypoints={Points}
              destination={Destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              mode="WALKING"
            />
        </MapView>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('finish',{
          id: id,
          chargername: chargername,
          chargerlat: chargerlat,
          chargerlng: chargerlng,
          planway: "自行排序",
          plan: planList,
        })}>
          <Text>結束路線規劃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCEEFF',
    // alignItems: 'center'
  },
  TitleContainer: {
    top:45,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mapStyle: {
    top: 80,
    marginLeft: 10,
    width: 390,
    height: '80%'
  },
  button: {
    top: 90,
    margin: 4,
    padding: 4,
    backgroundColor: '#cceeff',
    borderWidth:3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:5,
    paddingBottom:5,
    
  },
  backbutton: {
    margin: 4,
    padding: 4,
    backgroundColor: '#cceeff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:3,
  
  }
});
