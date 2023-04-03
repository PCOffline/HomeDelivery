
import * as Location from 'expo-location';
import { LocationObject, LocationType, StorageData } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


export const registerForPushNotificationsAsync = async () => {
    let token;
    try{
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.log("final is not granted");
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  
    return token;
    }catch (e){
      console.log("his is error");
      console.log(e);
      return token;
    }
  }
  
 export const CheckLocation = async () => {
    try{
      
      let  result  = await Location.requestForegroundPermissionsAsync();
      if (result.status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const thereturn = {
       thelocation: <LocationObject>{
          type:LocationType.point,
          coordinates:[location.coords.latitude, location.coords.longitude]
        },
        fullcoords:<Location.LocationObjectCoords>location.coords
      }
      return(thereturn);
    }
    catch{
      return;
    }
  }
  
    
  export const toDateTime = (secs:number) => {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}
