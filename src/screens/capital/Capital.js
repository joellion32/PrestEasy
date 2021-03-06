import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Item, Icon, Input, Form, ListItem, Right} from 'native-base';
import DatePicker from 'react-native-datepicker'
import ClientsModal from '../../components/ClientsModal';
import LoansModal from '../../components/LoansModal';
import ButtonAndroid from '../../components/Button';
import { saveCapital } from '../../services/DataService';
import dateConfig from '../../config/validation';
import { configData } from '../../services/ConfigServices';
import moment from 'moment';

export default function Capital() {
    const [formData, setFormData] = useState({})
    const [clienModal, setClientModal] = useState(false)
    const [loansModal, setLoansModal] = useState(false)
    const [client, setClient] = useState({})
    const [loan, setLoan] = useState({})
    const [formError, setFormError] = useState({})
    const [modalPrint, setModalPrint] = useState(false);
    const [company, setCompany] = useState({});
    const [dataPrint, setDataPrint] = useState({});

    useEffect(() => {
        configData().then(resp => {
            setCompany(resp)
        })
     }, [])
    
    const handleTextChange = (value, prop) => {
        setFormData({ ...formData, [prop]: value });
    }

    const validateCapital = () => {
        console.log(formData)
        Alert.alert(
            "¿Desea confirmar el pago?",
            "",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirmar", onPress: saveData }
            ],
            { cancelable: false }
        );
    }

    const saveData = () => {
        let errors = {}
        if (!client.name) errors.name = true;
        if (!loan.id) errors.loan = true;
        if (!formData.payment) errors.payment = true;
        else{
            let capital = {
                IdCliente: client.id,
                IdPrestamo: loan.id,
                Pago: Number(formData.payment), 
                Fecha: formData.date
            } 

            let dataPrint = {
                Cliente: client.name + " " + client.lastname,
                IdPrestamo: loan.id,
                Pago: Number(formData.payment)
            }

            saveCapital(capital).then(resp => {
                setDataPrint(dataPrint)
                setModalPrint(true)
            })
        }

        setFormError(errors)
    }

    
    const hideModal = (user, data) => {
        if(user == "client"){
            setClient(data)
            setClientModal(false)
        }else if(user == "loan"){
            setLoan(data)
            setLoansModal(false)
        }else if(user == "print"){
            setModalPrint(false)
        }
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <ClientsModal hideModal={hideModal} modalVisible={clienModal} />
            <LoansModal client={client.id} hideModal={hideModal} modalVisible={loansModal} />
            <ModalPrint dataPrint={dataPrint} modalPrint={modalPrint} hideModal={hideModal} company={company} />
            <View style={styles.header}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.box}>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>General</Text>
                    </View>
                </View>
            </View>


            <Form>
                <ListItem style={{ backgroundColor: '#f1f1f1' }} itemDivider>
                    <Icon style={styles.icon} name='people' />
                    <Text style={styles.textTitle}>  Datos del cliente y prestamo</Text>
                </ListItem>
                <Item onPress={() => setClientModal(true)}>
                    <Icon style={styles.icon} name='person' />
                    <Input placeholder="Cliente" value={client.name != undefined ? client.name + " " + client.lastname: ""} disabled={true} />
                    <Icon style={styles.icon} name='add-circle' />
                    {formError.name && <Text style={styles.textError}>El campo cliente es necesario</Text>}
                </Item>

    
                <Item onPress={() => setLoansModal(true)}>
                    <Icon style={styles.icon} name='logo-usd' />
                    <Input placeholder="Préstamo" value={loan.id != undefined ? "Préstamo Id: " + loan.id : ""} disabled={true} />
                    <Icon style={styles.icon} name='add-circle' />
                    {formError.loan && <Text style={styles.textError}>El campo préstamo es necesario</Text>}
                </Item>

                <Item>
                    <Icon style={styles.icon} name='logo-usd' />
                    <Input placeholder="Pago" keyboardType="numeric" onChangeText={(value) => handleTextChange(value, "payment")} />
                    {formError.payment && <Text style={styles.textError}>El campo pago es necesario</Text>}
                </Item>

                <Item style={{top: 5}} picker fixedLabel>
                        <Icon style={styles.icon} name='calendar' />

                        <DatePicker
                            style={{width: '90%', borderColor: '', fontSize: 20}}
                            date={formData.date}
                            mode="date"
                            format="YYYY-MM-DD"
                            placeHolderText="Fecha de pago"
                            textStyle={{ color: "green" }}
                            placeHolderTextStyle={{ color: "black" }}
                            onDateChange={(value) => handleTextChange(value, "date")}
                            disabled={false}
                        />
                    </Item>
            </Form>

            <View style={{ alignItems: 'center', justifyContent: 'center', top: 20 }}>
                    <ButtonAndroid onPress={validateCapital} />
            </View> 
        </SafeAreaView>
    )
}

function ModalPrint(props){
    const {modalPrint, dataPrint, hideModal, company} = props;
    const dateNow = new Date();
   
    return(
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalPrint}
                onRequestClose={() => hideModal("print")}
            >
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    <View style={styles.printContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.headerModal}>
                                <Image style={{width: 50, height: 50}} source={{uri: `data:image/png;base64,${company.company_logo}`}} />
                                <Text>{company.company_name}</Text>
                                <Text>{company.company_address}</Text>
                                <Text>{company.company_phone}</Text>
                            </View> 

                            <View style={{ marginTop: 20 }}>
                                <View style={styles.bodyModal}>
                                    <Text>Recibo:</Text>
                                    <Right> 
                                        <Text>#{dateConfig.receipt}</Text>
                                    </Right>
                                </View>
                                <View style={styles.bodyModal}>
                                    <Text>Fecha:</Text>
                                    <Right>
                                        <Text>{moment(dateNow).format('ll')}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Hora:</Text>
                                    <Right>
                                        <Text>{moment(dateNow).format('LT')}</Text>
                                    </Right>
                                </View>
                                <Text style={{ textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                                <View style={styles.bodyModal}>
                                    <Text>Pago capital:</Text>
                                    <Right>
                                        <Text>${dataPrint.Pago}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Cliente:</Text>
                                    <Right>
                                        <Text>{dataPrint.Cliente}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Prestamo Id:</Text>
                                    <Right>
                                        <Text># {dataPrint.IdPrestamo}</Text>
                                    </Right>
                                </View>
                            </View>
                        </ScrollView> 

                        <TouchableOpacity style={styles.buttonPrint}>
                            <Text>IMPRIMIR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fec400',
        height: 100,
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
    textTitle: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontWeight: 'bold'
    },
    textBalance: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red'
    },
    textError: {
        color: 'red',
        fontWeight: 'bold'
    },
    /*Modal */
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    bodyModal: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 10
    },
    headerModal: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    buttonPrint: {
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#fec400',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    printContainer: {
        width: 300,
        height: 620,
        backgroundColor: '#fff',
        borderRadius: 10
    }
})