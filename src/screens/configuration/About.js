import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import logo from '../../../assets/Logo.png';

export default function About(){
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.image} source={logo} />
                <Text style={styles.text}>Versión 0.1</Text>
                <Text style={styles.text}>© Desarrollado por Devin {new Date().getFullYear()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fec400',
        flex: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150
    },
    image: {
        width: 300,
        height: 125,
        backgroundColor: "#fff",
        borderRadius: 20
    },
    text: {
        top: 2,
        fontSize: 18, 
        color: 'white',
        fontWeight: 'bold'
    }
})