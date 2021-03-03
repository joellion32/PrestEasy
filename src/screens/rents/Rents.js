import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Modal } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import { getProperty, getRents, getVehicles } from '../../services/DataService';
import { Item, Icon, Input, Picker, Card, Right, Left, Button, ListItem, List, Body, Content } from 'native-base';
import ClientsModal from '../../components/ClientsModal';
import { ScrollView } from 'react-native-gesture-handler';
import { LSpinner } from '../../components/Loading';

export default function Rents({ navigation, route }) {
    const [properties, setProperties] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalDetail, setModalDetail] = useState(false)
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [dataModal, setDataModal] = useState({})

    useEffect(() => {
       if(user.id != undefined){
          getPropertiesData(user.id)
       }else{
           setProperties([])
       }
    }, [user, route.params?.post])


    // recibir todas los objetos en renta 
    const getPropertiesData = async (id) => {
        let properties = [];
        const data = await getRents(id)
        data.forEach(doc => {
           properties.push(doc.data())
        })

        setProperties(properties)
    }

    // obtener data del usuario al cerrar el modal 
    const hideModal = (userI, data) => {
        setUser(data)
        setModalVisible(false)
    }

    // Mostrar modal detalle
    const showModalDetail = (status, data) => {
        if (status == 1) {
            setModalDetail(true)
            setDataModal(data)
        } else {
            setModalDetail(false)
        }
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <ClientsModal hideModal={hideModal} modalVisible={modalVisible} />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Item style={{ borderColor: 'black' }} onPress={() => setModalVisible(true)}>
                        <Icon style={styles.icon} name='person' />
                        <Input placeholderTextColor="black" placeholder="Filtrar por cliente" value={user.name != undefined ? user.name + " " + user.lastname : ""} disabled={true} />
                        <Icon style={styles.icon} name='add-circle' />
                    </Item>
                </View>
            </View>


            <ScrollView>
                <LSpinner loading={loading} />
                <ModalDetail dataModal={dataModal} showModalDetail={showModalDetail} modalDetail={modalDetail} />
                {

                    properties.length != 0 ?

                    properties.map((item, index) => (
                        item.Tipo == "Vehiculo" ?
                        <ListVehicles vehicle={item} showModalDetail={showModalDetail}/> 
                        : item.Tipo == "Inmueble" &&
                        <ListProperties propertie={item} showModalDetail={showModalDetail}/>
                    ))
                    :
                    <Text style={{ textAlign: 'center', fontSize: 18, top: 50, height: 200 }}>No hay datos que mostrar</Text>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

function ListVehicles(props) {
    const { vehicle, showModalDetail } = props;

    return (
        <Card style={styles.card}>
            <List>
                <ListItem avatar noBorder>
                    <Left>
                        <Avatar.Icon size={60} icon="car" />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' }}>{vehicle.Vehiculo.Marca + " " + vehicle.Vehiculo.Modelo}</Text>
                        <Text style={{ fontSize: 18, color: 'black' }}>{vehicle.Vehiculo.Placa}</Text>
                    </Body>
                    <Right>
                        <Button style={styles.button} warning rounded
                            onPress={() => showModalDetail(1, vehicle)}>

                            <Text style={{ color: '#fff' }}>Información</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
        </Card>
    )
}


function ListProperties(props) {
    const { propertie, showModalDetail } = props;

    return (
        <Card style={styles.card}>
            <List>
                <ListItem avatar noBorder>
                    <Left>
                        <Avatar.Icon size={60} icon="home" />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' }}>{propertie.Inmueble.Descripcion}</Text>
                    </Body>
                    <Right>
                        <Button style={styles.button} warning rounded
                            onPress={() => showModalDetail(1, propertie)}>

                            <Text style={{ color: '#fff' }}>Información</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
        </Card>
    )
}

function ModalDetail(props) {
    const { modalDetail, showModalDetail, dataModal } = props;
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDetail}
            >
                <View style={styles.container}>
                    <View style={styles.headerModal}>
                        <IconButton
                            icon="arrow-left"
                            color="black"
                            size={25}
                            onPress={() => showModalDetail(2)}
                        />
                        <View style={styles.headerModalC}>
                            {
                                dataModal.Tipo == "Vehiculo" ?
                                    <>
                                        <Avatar.Icon color="black" size={90} icon="car" />
                                        <Text style={styles.textHeader}>{dataModal.Vehiculo.Marca + " " + dataModal.Vehiculo.Modelo}</Text>
                                        <Text style={styles.textHeader}>{dataModal.Tipo}</Text>
                                    </>
                                    : dataModal.Tipo == "Inmueble" &&
                                    <>
                                        <Avatar.Icon color="black" size={90} icon="home" />
                                        <Text style={styles.textHeader}>{dataModal.Inmueble.Descripcion}</Text>
                                        <Text style={styles.textHeader}>{dataModal.Tipo}</Text>
                                    </>
                            }
                        </View>
                    </View>

                    <Content>
                        {
                            dataModal.Tipo == "Vehiculo" ?
                                <List>
                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Año:</Text>
                                        </Left>
                                        <Right>
                                            <Text style={styles.textBody}>{dataModal.Vehiculo.Año}</Text>
                                        </Right>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Chasis:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Vehiculo.Chasis}</Text>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Cliente:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Cliente.name + " " + dataModal.Cliente.lastname}</Text>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Marca:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Vehiculo.Marca}</Text>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Modelo:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Vehiculo.Modelo}</Text>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Motor:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Vehiculo.Motor}</Text>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Placa:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{dataModal.Vehiculo.Placa}</Text>
                                    </ListItem>
                                </List>
                                : dataModal.Tipo == "Inmueble" && (
                                    <List>
                                        <ListItem>
                                            <Left>
                                                <Text style={styles.textBody}>Cliente:</Text>
                                            </Left>
                                            <Text style={styles.textBody}>{dataModal.Cliente.name + " " + dataModal.Cliente.lastname}</Text>
                                        </ListItem>

                                        <ListItem>
                                            <Left>
                                                <Text style={styles.textBody}>Descripción:</Text>
                                            </Left>
                                            <Text style={styles.textBody}>{dataModal.Inmueble.Descripcion}</Text>
                                        </ListItem>
                                    </List>
                                )
                        }
                    </Content>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        color: 'black'
    },
    header: {
        backgroundColor: '#fec400',
        height: 60,
    },
    headerContent: {
        textAlign: 'left',
        marginHorizontal: 10,
        bottom: 5
    },
    button: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        top: 10
    },
    card: {
        paddingVertical: 20,
        justifyContent: 'center'
    },
    /* Modal detail*/
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    headerModal: {
        width: "100%",
        backgroundColor: '#fec400',
        height: 150,
    },
    textHeader: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: '100',
        bottom: 10,
        textTransform: 'uppercase'
    },
    headerModalC: {
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50
    },
    textBody: {
        fontSize: 18
    }

})