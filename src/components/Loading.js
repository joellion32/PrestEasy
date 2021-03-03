import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Spinner } from 'native-base';

export default function Loading(props){
    const {loading} = props;

    return(
        <View style={[styles.container, loading ? {display: 'flex'} : {display: 'none'}]}>
            <Spinner color='white' />
            <Text style={styles.text}>Cargando..</Text>
        </View>
    )
}

export function LSpinner(props){ 
const {loading} = props;

   return (
       <View style={loading ? {display: 'flex'} : {display: 'none'}}>
            <Spinner color='#fec400' />
        </View>
   )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        backgroundColor: 'black',
        height: 50,
        marginTop: 50,
        alignItems: 'center',
        width: "90%",
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10
    }
})