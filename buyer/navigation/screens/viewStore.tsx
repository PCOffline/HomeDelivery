import React, {useState, useEffect} from "react";
import {View, Text, Button, Pressable, StyleSheet, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Product, RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { getDistance, toDateTime } from "../../functions";
import ProductsGrid from "../../components/product/products_grid";
import { storeActions } from "../../hooks/stores";

interface Props {
    Store:Store;
    thelocation:LocationObject;
    setSelectedProduct:React.Dispatch<React.SetStateAction<Product | undefined>>;
}

const imageUri = uri+"data/file/";
export const ViewStore = (props:Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [OpenDateString, setOpenDateString] = useState("");
    const [CloseDateString, setCloseDateString] = useState("");
    const [displayProducts, setDisplayProducts] = useState<Product[]>();

    useEffect(() => {
        const OpenDate = toDateTime(props.Store.openHoursObject.openFrom).toLocaleTimeString().split(":");
        
        console.log(props.Store.openHoursObject.closedFrom)
        if (props.Store.openHoursObject.closedFrom > 86400) props.Store.openHoursObject.closedFrom -= 86400
        const CloseDate = toDateTime(props.Store.openHoursObject.closedFrom).toLocaleTimeString().split(":");
        


        setOpenDateString(OpenDate[0]+":"+OpenDate[1]);
        setCloseDateString(CloseDate[0]+":"+CloseDate[1]);

    }, [])

    useEffect(() => {
        ( async() => {
          setDisplayProducts(await storeActions.GetProducts(props.Store._id))
        })()
    }, [props.Store])
    return (
        
        <View style={{backgroundColor:'white', height:'100%'}}>
        <ScrollView>
        <View style={styles.Conteintor}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate("tabs", {id:1})}><Text style={styles.backButtonText}>Back</Text></Pressable>
        <Image style={styles.imageStyle} source={
            {uri:imageUri+props.Store?.logo,
                cache:"force-cache"
                
            }} />
        <View style={styles.storeInfo}>
        <Text style={styles.StoreName}>{props.Store?.name}</Text>
        <View style={styles.detailsView}><Text style={styles.detailsText}>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}>{Math.round(getDistance(props.Store.location, props.thelocation))+ " km"}</Text></View>
        </View>
        </View>
        <ProductsGrid title="" thelocation={props.thelocation} displayProducts={displayProducts} setSelectedProduct={props.setSelectedProduct}/>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton:{
        zIndex:3,
        borderTopRightRadius:40,
        borderBottomRightRadius:40,
        backgroundColor:'lightgreen',
        height:40,
        width:55,
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
        top:10,
        left:25
        },
        detailsView:{
            display:'flex',
            flexDirection:'row',

        },
        detailsText:{
            marginRight:5,
        },
    backButtonText:{
        fontSize:16,
        color:'black'
    }, 
    Conteintor:{
        justifyContent:'center',
        display:'flex',
        flexDirection:'row',
        width:'100%',
        height:'auto',
    },
    StoreName:{
        fontSize:18,
    }, 
    ProductsView:{
        height:'auto',
        width:'100%',
        backgroundColor:'red'
    },
    storeInfo:{
        width:"100%",
        padding:10,
        marginTop:200,
    }, 
    imageStyle:{
        position:'absolute',
        top:0,
        height:200,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        width:'100%'
    }
})