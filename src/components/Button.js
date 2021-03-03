import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function ButtonAndroid(props){
    const {onPress} = props;

    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.textButton}>CONFIRMAR</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        height: 50,
        marginTop: 15,
        width: '95%',
        justifyContent: 'center',
        backgroundColor: '#fec400',
        borderRadius: 10
    },
    textButton: {
        fontSize: 15,
        textTransform: 'uppercase',
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})