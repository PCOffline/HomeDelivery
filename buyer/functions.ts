
import * as Location from 'expo-location';
import { LocationObject, LocationType, Order, Product, StorageData, Store } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { ObjectId } from 'mongodb';


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


  export const GetOptionProduct = (Store:Store, OptionProdcutId:ObjectId) => {
    for (let i =0;i < Store.optionProducts.length;i++)
    {
      if (Store.optionProducts[i]._id === OptionProdcutId)
      {
        return Store.optionProducts[i];
      }
    }
    return;
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

  export const getOccurrence = (array:Array<any>, value:any) => {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

export const RemoveOrAddFromOrder = (removeOrAdd:0|1, setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined| null>>, savedOrder:Order | undefined| null, SelectedProduct:Product) => {
  if (!savedOrder) return false;
  console.log(savedOrder.selecedProdcuts);
  if (removeOrAdd === 0)
  {
    //remove
    for (let i = 0; i < savedOrder.selecedProdcuts.length; i++)
    {
      console.log(SelectedProduct);
      if (JSON.stringify(savedOrder.selecedProdcuts[i]) === JSON.stringify(SelectedProduct))
      {
        
        const savedOrder1 = savedOrder;
        savedOrder1.selecedProdcuts.splice(i, 1);
        setSavedOrder(savedOrder1);
        return true;
      }
    }
    return false;
  }
  else
  {
    //add
    var previousOrder = savedOrder;
    if (previousOrder)
    {
      console.log("here");
        previousOrder.selecedProdcuts.push(SelectedProduct);
        setSavedOrder(previousOrder);
        console.log(savedOrder.selecedProdcuts);
        return true;
    }
    else
    {
      return false;
    } 
  }
}
  
    
  export const toDateTime = (secs:number) => {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}


export const getDistance = (Location1:LocationObject, Location2:LocationObject ) => {
  if (Location1.coordinates && Location2.coordinates)
  {
  const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
  const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
  const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574; //im km
  return distance;
  }
  else{
      return 0;
  }
}