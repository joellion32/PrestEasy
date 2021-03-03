import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, View, Modal, TouchableOpacity, Image, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Item, Icon, Input, Form, ListItem, Picker, Right} from 'native-base';
import ButtonAndroid from '../../components/Button';
import ClientsModal from '../../components/ClientsModal';
import GuarantorsModal from '../../components/GuarantorsModal';
import ObjectsModal from '../../components/ObjectsModal';
import { getPendingLoan, saveLoans } from '../../services/LoansServices';
import dateConfig from '../../config/validation';
import moment from 'moment';
import { configData } from '../../services/ConfigServices';

export default function RegisterLoans(props){
    const {navigation} = props;
    const [modalVisible, setModalVisible] = useState(false)
    const [modalClient, setModalClient] = useState(false);
    const [modalGuarantor, setModalGuarantor] = useState(false);
    const [modalPrint, setModalPrint] = useState(false);
    const [client, setClient] = useState({}); 
    const [guarantor, setGuarantor] = useState({}); 
    const [propertie, setPropertie] = useState({})
    const [formError, setFormError] = useState({})
    const [dataPrint, setDataPrint] = useState({})
    const [company, setCompay] = useState({});
    const [formData, setFormData] = useState({
        status: "Normal",
        type: "Mensual"
    });
     

    useEffect(() => {
       configData().then(resp => {
        setCompay(resp)
       })
    }, [])


    const handleTextChange = (value, prop) => {
        setFormData({ ...formData, [prop]: value });
    }

    // mostrar modal
    const showModal = (modal) => {
        if(modal === "client"){
            setModalClient(true)
        }else if(modal === "guarantor"){
            setModalGuarantor(true)
        }else if(modal === "objects"){
            setModalVisible(true)
        }
    }

    // cerrar modal
    const hideModal = (modal, data) => {
        if(modal === "client"){
            setModalClient(false)
            setClient(data)
        }else if(modal === "guarantor"){
            setModalGuarantor(false)
            setGuarantor(data)
        }else if(modal === "objects"){
            setModalVisible(false)
            setPropertie(data)
        }else if(modal == "print"){
            setModalPrint(false)
        }
    } 

    // validar prestamo
    const validateLoan = () => {
        Alert.alert(
            "¿Desea confirmar el pago?",
            "",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirmar", onPress: saveLoan }
            ],
            { cancelable: false }
        );
    }



    // guardar prestamo
    const saveLoan = async () => {
        let errors = {}
        if(!formData.mount || !formData.interest || !formData.place || !formData.status){
            if (!client.name) errors.name = true;
            if (!formData.mount) errors.mount = true;
            if (!formData.interest) errors.interest = true;
            if (!formData.place) errors.place = true;
            if (!formData.status) errors.status = true;
            if (!formData.type) errors.type = true;
        }
        else{
           const data = await saveLoans(client, guarantor, propertie, formData)
            getPendingLoan(data.id).then(resp => {
                setDataPrint(resp.data())
                setModalPrint(true)
            }) 
        }
        setFormError(errors)
    }
    
 return(
    <SafeAreaView style={{height: '100%'}}>
        <ClientsModal navigation={navigation} hideModal={hideModal} modalVisible={modalClient} />
        <GuarantorsModal navigation={navigation} hideModal={hideModal} modalVisible={modalGuarantor} />
        <ObjectsModal client={client.id} modalVisible={modalVisible} hideModal={hideModal} />
        <ModalPrint company={company} dataPrint={dataPrint} modalPrint={modalPrint} hideModal={hideModal}/>

        <ScrollView showsVerticalScrollIndicator={false}>
             <Form>
                 <ListItem style={{backgroundColor: '#f1f1f1'}} itemDivider>
                     <Icon style={styles.icon} name='people' />
                     <Text style={styles.textTitle}>  Datos de cliente y garante</Text>
                 </ListItem> 
                 <Item onPress={() => showModal("client")}>
                     <Icon style={styles.icon} name='person' />
                     <Input placeholder="Cliente" value={client.name ? client.name + " " + client.lastname: ""} disabled={true} />
                     <Icon style={styles.icon} name='add-circle' />
                     {formError.name && <Text style={styles.textError}>El campo cliente es necesario</Text>}
                 </Item> 

                 <Item onPress={() => showModal("guarantor")}>
                     <Icon style={styles.icon} name='person' />
                     <Input placeholder="Garante" value={guarantor.name ? guarantor.name + " " + guarantor.lastname: ""} disabled={true} />
                     <Icon style={styles.icon} name='add-circle' />
                 </Item> 

                 <ListItem style={{backgroundColor: '#f1f1f1'}} itemDivider>
                     <Icon style={styles.icon} name='home' />
                     <Text style={styles.textTitle}>  Garantías</Text>
                 </ListItem> 

                 <Item onPress={() => showModal("objects")}>
                     <Icon style={styles.icon} name='car' />
                     <Input placeholder="Objetos en renta" value={propertie.name} disabled={true} />
                     <Icon style={styles.icon} name='add-circle' />       
                 </Item> 


                 <ListItem style={{backgroundColor: '#f1f1f1'}} itemDivider>
                     <Icon style={styles.icon} name='cash' />
                     <Text style={styles.textTitle}>  Datos de préstamo</Text>
                 </ListItem> 
                 <Item>
                     <Icon style={styles.icon} name='logo-usd' />
                     <Input placeholder="Monto" keyboardType="numeric"  onChangeText={(value) => handleTextChange(value, 'mount')} />
                     {formError.name && <Text style={styles.textError}>El campo cliente es necesario</Text>}
                 </Item> 

                 <Item>
                     <Icon style={styles.icon} name='calendar' />
                     <Input placeholder="Plazo" keyboardType="numeric"  onChangeText={(value) => handleTextChange(value, 'place')} />
                     {formError.place && <Text style={styles.textError}>El campo plazo es necesario</Text>}
                 </Item>

                 <Item>
                     <Icon style={styles.icon} name='cellular' />
                     <Input placeholder="Interés %" keyboardType="numeric"  onChangeText={(value) => handleTextChange(value, 'interest')} />
                     {formError.interest && <Text style={styles.textError}>El campo interés es necesario</Text>}
                 </Item>

                 <Item picker fixedLabel>
                        <Icon style={styles.icon} name='people' />

                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Tipo de préstamo"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={formData.status}
                            onValueChange={(value) => handleTextChange(value, "status")}
                        >
                            <Picker.Item label="Normal" value="Normal" />
                            <Picker.Item label="Solo interés" value="Solo interés" />
                            <Picker.Item label="Al vencimiento" value="Al vencimiento" />
                            <Picker.Item label="Amonetizado cuotas fijas" value="Amonetizado cuotas fijas" />
                            <Picker.Item label="Factorings" value="5" />
                            <Picker.Item label="Disminuir cuotas" value="Disminuir cuotas" />
                        </Picker>
                    </Item>


                    <Item picker fixedLabel>
                        <Icon style={styles.icon} name='calendar' />

                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Tipo de préstamo"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={formData.type}
                            onValueChange={(value) => handleTextChange(value, "type")}
                        >
                            <Picker.Item label="Mensual" value="Mensual" />
                            <Picker.Item label="Quincenal" value="Quincenal" />
                            <Picker.Item label="Semanal" value="Semanal" />
                            <Picker.Item label="Diario" value="Diario" />
                        </Picker>
                    </Item>

                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                     <ButtonAndroid onPress={validateLoan} />
                 </View>
             </Form>
        </ScrollView>
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
                                    <Text>Cantidad solicitada:</Text>
                                    <Right>
                                        <Text>${dataPrint.MontoPrestamo}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Interés %:</Text>
                                    <Right>
                                        <Text>{dataPrint.Interes}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Cliente:</Text>
                                    <Right>
                                        <Text>{dataPrint.NombreCliente}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Garante:</Text>
                                    <Right>
                                        <Text>{dataPrint.NombreGarante != "" ? dataPrint.NombreGarante: "No tiene"}</Text>
                                    </Right>
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text>Tipo Cobro:</Text>
                                    <Right>
                                        <Text>{dataPrint.TipoCobro}</Text>
                                    </Right>
                                </View>


                                <View style={styles.bodyModal}>
                                    <Text>Tipo Préstamo:</Text>
                                    <Right>
                                        <Text>{dataPrint.TipoPrestamo}</Text>
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
    icon: {
        color: 'black',
        fontWeight: 'bold'
    },
    textTitle: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontWeight: 'bold'
    },
    button: {
        height: 50, 
        marginTop: 15,
        width: '95%',
        justifyContent: 'center',
        backgroundColor: '#fec400',
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
        marginTop: 8
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