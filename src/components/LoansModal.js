import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { getLoansClient } from '../services/LoansServices';
import { Appbar, Avatar } from 'react-native-paper';
import { Left, Right, List, ListItem, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';


export default function LoansModal(props) {
    const { modalVisible, hideModal, client } = props;
    const [loans, setLoans] = useState([])
    
    useEffect(() => {
        getLoansClient(client).then(resp => {
            let array = []
            resp.forEach(doc => {
                array.push(doc.data())
            })

            setLoans(array)
        })
    }, [client])

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
                            <Appbar.BackAction size={30} onPress={() => hideModal("loan", "")} />
                            <Appbar.Content style={{ alignItems: 'center' }} title={"Préstamos"} />
                            <Appbar.Action size={30} />
                        </Appbar.Header>
                    </View>

                    <ScrollView>
                        <List>
                            {
                                loans.length != 0 ?
                                loans.map((item, index) => (
                                        <ListItem key={index} avatar onPress={() => hideModal("loan", item)}>
                                            <Left>
                                                <Avatar.Icon size={50} icon="currency-usd" />
                                            </Left>
                                            <Body style={{ paddingTop: 15 }}>
                                                <Text style={styles.textBody}>Prestamo Id: {item.id}</Text>
                                                <Text style={styles.textBody}>Balance Prestamo: ${Math.floor(item.BalancePrestamo)}</Text>
                                            </Body>
                                            <Right style={{ justifyContent: 'center' }}>
                                                <Icon active name="arrow-forward" />
                                            </Right>
                                        </ListItem>
                                    ))
                                    :
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>No hay información para mostrar</Text>
                            }
                        </List>
                    </ScrollView>
                </View>
            </Modal>
        </View>
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
        fontSize: 15,
        textTransform: 'uppercase'
    }
})