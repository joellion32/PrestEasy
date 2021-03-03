import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import ListUsers from '../../components/ListUsers';
import { getTotalGuarantors } from '../../services/ClientsService';
import { LSpinner } from '../../components/Loading';
import { filterItems } from '../../config/validation';
import ModalDetail from '../../components/ModalDetail';

export default function Guarantors({navigation, route}){
    const [searchQuery, setSearchQuery] = useState('');
    const [guarantors, setGuarantors] = useState([])
    const [totalGuarantos, setTotalGuarantos] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [dataModal, setDataModal] = useState({});

    useEffect(() => {
        getGuarantors()
        getTotalG()
    }, [route.params?.post])

    // get guarantors and format data 
    const getGuarantors = () => {
        setLoading(true);
        getTotalGuarantors().then(resp => {
            let dataGuarantors = [];
            resp.forEach((doc) => {
                const data = doc.data() 
                dataGuarantors.push({
                    name: data.Persona.NombrePersona + " " + data.Persona.ApellidoPersona,
                    surname: data.Persona.ApodoCliente,
                    rnc: data.Persona.CedulaPersona,
                    balance: data.Balance,
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
            setGuarantors(dataGuarantors)
        })
    }

    // get total numbers of guarantors
    const getTotalG = () => {
        getTotalGuarantors()
            .then(snapshot => {
                let guarantors = [];
                snapshot.forEach(doc => {
                    guarantors.push(doc.data())
                });
                setTotalGuarantos(guarantors)
            })
    }

    // search data 
    const onChangeSearch = (search) => {
        setSearchQuery(search)
        if (guarantors == 0 || search == '') {
            getGuarantors()
        } else {
            setGuarantors(filterItems(guarantors, search, "name"))
        }
    }


    //show detail client information
    const showModalDetail = (client) => {
        setModalVisible(true)
        setDataModal(client)
    }

     // hide Modal payment
     const hideModal = () => setModalVisible(false);
    return(
        <SafeAreaView style={{ height: "100%" }}>
            <ModalDetail dataModal={dataModal} hideModal={hideModal} modalVisible={modalVisible} />

            <View style={styles.header}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.box}>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>General</Text>
                    </View>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.textHeader}>Total Garantes: {totalGuarantos.length}</Text>
                </View>
            </View>

            <Searchbar
                onChangeText={onChangeSearch}
                value={searchQuery}
                placeholder="Buscar garante" />

            <ScrollView>
                <LSpinner loading={loading} />

                {
                    guarantors.map((item, index) => (
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