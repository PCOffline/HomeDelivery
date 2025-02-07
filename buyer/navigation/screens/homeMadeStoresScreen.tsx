import { ScrollView, StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { availableStores, LocationObject, Order, Pages, Store, store_category } from '../../interfaces';
import StoresGrid from '../../components/store/stores_grid';
import { useEffect, useState } from 'react';
import { storeActions } from '../../network_services/stores';

interface Props {
    location:LocationObject;
    homeMadeStores:availableStores | null | undefined;
    setHomeMadeStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    refreshing:boolean;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    setSelectedProductUnits:React.Dispatch<React.SetStateAction<number>>;
    selectedProductUnits:number;
  }
const HomeMadeStores = (props:Props) => {

    const [loading, setLoading] = useState(true);

    const load = async () => {
        props.setHomeMadeStores(await storeActions.GetStores(props.location, store_category.homeMade));
    }


    useEffect(() => {
        
        load();
        if (props.homeMadeStores)
        {
            setLoading(false);
        }
    }, [])
    
    useEffect(() => {
        if (props.refreshing)
        {
         setLoading(true);
         props.setHomeMadeStores(null);
         load();
        }
        else
        {
            setLoading(false);
        }
    }, [props.refreshing]) 

    const getContent = () => {

        return ( <View style={style.view}>
            <Text style={style.title}>Creativity Place .</Text>
            <ScrollView>
             <StoresGrid setSelectedProductUnits={props.setSelectedProductUnits} selectedProductUnits={props.selectedProductUnits} setSavedOrder={props.setSavedOrder} thelocation={props.location} setSelectedStore={props.setSelectedStore}  title='New On HomeDelivery' displayStores={props.homeMadeStores?.Open} />
             <StoresGrid setSelectedProductUnits={props.setSelectedProductUnits} selectedProductUnits={props.selectedProductUnits} setSavedOrder={props.setSavedOrder} thelocation={props.location} setSelectedStore={props.setSelectedStore}  title='Closed Stores' displayStores={props.homeMadeStores?.Closed} />
             
            
            </ScrollView>
            </View>)
    }

return (
    getContent()
);
}


const style = StyleSheet.create({
    view:{
        width:'100%',
        height:'100%',
        
    },

    title:{
        fontSize:22 ,
        marginLeft:10,
        marginTop:10,
        fontFamily:'AmericanTypewriter',
        fontWeight:'bold'
        
    }
})

export default HomeMadeStores;