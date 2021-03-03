import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import ListUsers from '../../components/ListUsers';
import { getTotalClients } from '../../services/ClientsService';
import { LSpinner } from '../../components/Loading';
import { filterItems } from '../../config/validation';
import ModalDetail from '../../components/ModalDetail';


export default function Clients({navigation, route}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([])
    const [totalClients, setTotalClients] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [dataModal, setDataModal] = useState({});

    useEffect(() => {   
        setClients([])
        getClients()
        getTotal()
    }, [route.params?.post])


    // get clients and format data 
    const getClients = () => {
        setLoading(true);
        getTotalClients().then(resp => {
            let dataClient = [];
            resp.forEach((doc) => {
                const data = doc.data()
                dataClient.push({
                    name: data.Persona.NombrePersona + " " + data.Persona.ApellidoPersona,
                    surname: data.Persona.ApodoCliente,
                    date: new Date(data.FechaRegistro.seconds * 1000),
                    rnc: data.Persona.CedulaPersona,
                    active: data.EsActivo,
                    credit: data.LimiteCredito,
                    datebirth: new Date(data.Persona.FechaNacimiento.seconds * 1000),
                    ocupation: data.Persona.Ocupacion,
                    rent: data.Persona.Renta,
                    mount_rent: data.Persona.MontoRenta,
                    state: data.Persona.EstadoCivil,
                    phone: data.Persona.CelularPersona,
                    email: data.Persona.CorreoElectronico,
                    gender: data.Persona.Sexo,
                    location: data.Persona.DireccionPersona
                })
            })
            setLoading(false);
            setClients(dataClient)
        })
    }

    // get total numbers of clients
    const getTotal = () => {
        getTotalClients()
            .then(snapshot => {
                let clients = [];
                snapshot.forEach(doc => {
                    clients.push(doc.data())
                });
                setTotalClients(clients)
            })
    }

    // search data 
    const onChangeSearch = (search) => {
        setSearchQuery(search)
        if (clients == 0 || search == '') {
            getClients()
        } else {
            setClients(filterItems(clients, search, "name"))
        }
    }


    //show detail client information
    const showModalDetail = (client) => {
        console.log(client)
        setModalVisible(true)
        setDataModal(client)
    }

     // hide Modal payment
     const hideModal = () => setModalVisible(false);

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <ModalDetail dataModal={dataModal} hideModal={hideModal} modalVisible={modalVisible} />

            <View style={styles.header}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.box}>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>General</Text>
                    </View>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.textHeader}>Total Clientes: {totalClients.length}</Text>
                </View>
            </View>

            <Searchbar
                onChangeText={onChangeSearch}
                value={searchQuery}
                placeholder="Buscar cliente" />

            <ScrollView>
                <LSpinner loading={loading} />

                {
                    clients.map((item, index) => (
                        <ListUsers showModalDetail={showModalDetail} key={index} client={item} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fec400',
        height: 150,
    },
    headerContent: {
        textAlign: 'left',
        marginTop: 15,
        marginHorizontal: 10
    },
    box: {
        marginTop: 25,
        backgroundColor: 'black',
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    textHeader: {
        color: 'black',
        fontSize: 20,
        fontWeight: '100',
        top: 20
    }
})