import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, NativeModules } from 'react-native';
import { List, ListItem, Left, Right, Icon, Button, Text, Body } from 'native-base';
import { LSpinner } from '../../components/Loading';
import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';


export default function Printer() {


    useEffect(() => {
        verifyBluetooh();
    }, [])


    const verifyBluetooh = () => {
        BluetoothManager.isBluetoothEnabled().then((enabled)=> {
            alert(enabled) // enabled ==> true /false
        }, (err)=> {
            alert(err)
        });
    }


    const  enableBluetooh = () => {
        BluetoothManager.enableBluetooth().then((r) => {
            var paired = [];
            if (r && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    try {
                        paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
                    } catch (e) {
                        //ignore
                    }
                }
            }
            console.log(JSON.stringify(paired))
        }, (err) => {
            alert(err)
        });
    }

    const connectDevice = () => {
        BluetoothManager.connect("00:15:83:FA:4F:40") // the device address scanned.
            .then((s) => {
            console.log(s)
        }, (e) => {
            console.log(e);
        })
    }

    const printTest = () => {
        BluetoothEscposPrinter.printerInit()
        BluetoothEscposPrinter.printText("Hola mundo", {})
            .then(() => {
                console.log("Imprimiendo")
            },
            (err) => {
             console.log(err)
        })
    }


    return (
        <SafeAreaView>
            <Button onPress={connectDevice}>
                <Text>Conectar</Text>
            </Button>

            <Button onPress={printTest}>
                <Text>Imprimir</Text>
            </Button>
        </SafeAreaView>
    );
}