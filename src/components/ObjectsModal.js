import React, {useEffect, useState} from 'react';
import { View, Modal, Text, StyleSheet, SafeAreaView } from 'react-native';
import {ListItem, List, Body, Icon, Right} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar } from 'react-native-paper';
import { getRents } from '../services/DataService';

export default function ObjectsModal(props){
    const {modalVisible, hideModal, client} = props;
    const [properties, setProperties] = useState([])

    useEffect(() => {
        getpropertiesData()
    }, [client])


    // get data properties
    const getpropertiesData = async () => {
       let array = []
       const data = await getRents(client)
       data.forEach(doc => {
        array.push(doc.data())
       })

       setProperties(array)
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Appbar.Header style={styles.menu}>
                            <Appbar.BackAction size={30} onPress={() => hideModal("objects", "")} />
                            <Appbar.Content style={{ alignItems: 'center' }} title={"Objetos en renta"} />
                            <Appbar.Action/>
                        </Appbar.Header>
                    </View>

                    <SafeAreaView style={{ top: 10, height: '100%' }}>
                        <ScrollView>
                            {
                                properties.length != 0 ?
                                    properties.map((item, index) => (
                                        item.Tipo == "Vehiculo" ?
                                            <Vehicles vehicle={item} hideModal={hideModal} />
                                            : item.Tipo == "Inmueble" &&
                                            <Propertie propertie={item} hideModal={hideModal} />
                                    ))
                                    :
                                    <Text style={{ textAlign: 'center', fontSize: 18, top: 50, height: 200 }}>No hay datos que mostrar</Text>
                            }
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    )
}

function Vehicles(props){
    const {vehicle, hideModal} = props;

    return (
        <List>
            <ListItem onPress={() => hideModal("objects", {name: vehicle.Vehiculo.Marca + " " + vehicle.Vehiculo.Modelo})}>
                <Icon style={{ fontSize: 30 }} name="car" />
                <Body style={{ marginHorizontal: 10 }}>
                    <Text style={styles.textBody}>CARRO</Text>
                    <Text style={styles.textBody}>{vehicle.Vehiculo.Marca + " " + vehicle.Vehiculo.Modelo}</Text>
                </Body>
                <Right style={{ justifyContent: 'center' }}>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </List>
    )
}

function Propertie(props){
    const {propertie, hideModal} = props;
    return (
        <List>
            <ListItem onPress={() => hideModal("objects", {name: propertie.Inmueble.Descripcion})}>
                <Icon style={{ fontSize: 30 }} name="home" />
                <Body style={{ marginHorizontal: 10 }}>
                    <Text style={styles.textBody}>PROPIEDAD</Text>
                    <Text style={styles.textBody}>{propertie.Inmueble.Descripcion}</Text>
                </Body>
                <Right style={{ justifyContent: 'center' }}>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </List>
    )
}

const styles = StyleSheet.create({
    menu: {
        height: 50,
    },
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    header: {
        width: "100%",
        backgroundColor: '#fec400',
        justifyContent: 'center'
    },
    headerContent: {
        flexDirection: 'row',
    },
    textHeader: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: '100',
        top: 5
    },
    textBody: {
        fontSize: 18,
        textTransform: 'uppercase'
    }
})