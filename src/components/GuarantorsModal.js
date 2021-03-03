import { Left, Right, List, ListItem, Body, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Avatar, Searchbar } from 'react-native-paper';
import { getTotalGuarantors } from '../services/ClientsService';
import { filterItems } from '../config/validation';

export default function GuarantorsModal(props) {
    const {navigation} = props;
    const { modalVisible, hideModal } = props;
    const [guarantors, setGuarantors] = useState([])
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        getTotalGuarantors().then(resp => {
            let guarantors = []
            resp.forEach(doc => {
                const data = doc.data()
                guarantors.push({
                    id: data.id,
                    name: data.Persona.NombrePersona,
                    lastname: data.Persona.ApellidoPersona
                })
            })
            setGuarantors(guarantors)
        })
    }

    // search data 
    const onChangeSearch = (search) => {
        setSearchQuery(search)

        if (guarantors == 0 || search == '') {
            getData();
        } else {
            setGuarantors(filterItems(guarantors, search, "name"))
        }
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => hideModal("guarantor", "")}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Appbar.Header style={styles.menu}>
                        <Appbar.BackAction size={30} onPress={() => hideModal("guarantor", "")} />
                            <Appbar.Content style={{ alignItems: 'center' }} title={"Garantes"} />
                            <Appbar.Action size={30} icon="account-multiple-plus" onPress={() => {
                                hideModal("guarantor", "")
                                navigation.navigate("CreateClients", {title: "Crear garante"})
                            }} />
                        </Appbar.Header>
                    </View>

                    <Searchbar
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        placeholder="Buscar garante" />

                    <ScrollView>
                        <List>
                            {
                                guarantors.length != 0 ?
                                guarantors.map((item, index) => (
                                    <ListItem avatar onPress={() => hideModal("guarantor", item)}>
                                        <Left>
                                            <Avatar.Icon size={50} icon="account-circle" />
                                        </Left>
                                        <Body style={{ paddingTop: 15 }}>
                                            <Text style={styles.textBody}>{item.name}</Text>
                                            <Text style={styles.textBody}>{item.lastname}</Text>
                                        </Body>
                                        <Right style={{ justifyContent: 'center' }}>
                                            <Icon active name="arrow-forward" />
                                        </Right>
                                    </ListItem>
                                ))
                                :
                                <Text style={{textAlign: 'center', fontSize: 18}}>No hay información para mostrar</Text>
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