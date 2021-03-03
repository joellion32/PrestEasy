import React, { useState } from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import { Item, Icon, Input, Form, Picker, ListItem, Left} from 'native-base';
import ClientsModal from '../../components/ClientsModal';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonAndroid from '../../components/Button';
import { createRent, rents } from '../../services/DataService';

export default function CreateRents(props){
const {navigation} = props;    
const [status, setStatus] = useState(1)
const [formData, setFormData] = useState({})
const [formError, setFormError] = useState({})
const [modalVisible, setModalVisible] = useState(false)
const [user, setUser] = useState({})

    const handleTextChange = (value, prop) => {
        setFormData({ ...formData, [prop]: value });
    } 


    const hideModal = (user, data) => {
        setUser(data)
        setModalVisible(false)
    }
     // save data rent 
     const saveData = async () => {
        const docCharge = rents()

        let errors = {}
        if (status == 1) {
            if (!formData.year) errors.year = true;
            if (!formData.chassis) errors.chassis = true;
            if (!formData.color) errors.color = true;
            if (!formData.mark) errors.mark = true;
            if (!formData.model) errors.model = true;
            if (!formData.motor) errors.motor = true;
            if (!formData.license) errors.license = true;
            else{
                let rents = {
                    Año: formData.year,
                    Chasis: formData.chassis,
                    Color: formData.color,
                    Fecha: new Date(),
                    IdVehiculo: (await docCharge).id,
                    Marca: formData.mark,
                    Modelo: formData.model,
                    Motor: formData.motor,
                    Placa: formData.license,
                }
                createRent(status, rents, user).then(resp => {
                    navigation.navigate("Rents", {post: true})
                })
            }
        } else if(status == 2) {
            if (!formData.description) errors.description = true;
            else{
                let rents = {
                    Descripcion: formData.description,
                    Fecha: new Date(),
                    IdInmueble: (await docCharge).id,
                }

                createRent(status, rents, user).then(resp => {
                    navigation.navigate("Rents", {post: true})
                })
            }
        }
        setFormError(errors)
    }
    
    return(
        <SafeAreaView style={{height: '100%'}}>
            <ClientsModal hideModal={hideModal} modalVisible={modalVisible} />
             <ScrollView showsVerticalScrollIndicator={false}>
                <Form>
                    <Item picker fixedLabel>
                        <Icon style={styles.icon} name='document-text' />
                        <Left>
                            <Text style={{fontSize: 15}}>Tipo de contrato</Text>
                        </Left>

                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Tipo de préstamo"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={status}
                            onValueChange={(value) => setStatus(value)}
                        >
                            <Picker.Item label="Vehiculo" value="1" />
                            <Picker.Item label="Inmueble" value="2" />
                        </Picker>
                    </Item>
                    {
                        status == 1 ?
                        <FormVehicle formError={formError} user={user} setModalVisible={setModalVisible} handleTextChange={handleTextChange}/> 
                        :
                        <FormProperty formError={formError} user={user} setModalVisible={setModalVisible} handleTextChange={handleTextChange}/>
                    }
                    </Form>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ButtonAndroid onPress={saveData} />
                    </View>
             </ScrollView>
        </SafeAreaView>
    )
}

function FormVehicle(props){
    const {handleTextChange, setModalVisible, user, formError} = props;
return(
    <>
        <Item>
            <Icon style={styles.icon} name='calendar' />
            <Input placeholder="Año" keyboardType="numeric" onChangeText={(value) => handleTextChange(value, 'year')} />
            {formError.year && <Text style={styles.textError}>El campo año es necesario</Text>}
        </Item>

        <Item>
            <Icon style={styles.icon} name='car' />
            <Input placeholder="Chasis" onChangeText={(value) => handleTextChange(value, 'chassis')} />
            {formError.chassis && <Text style={styles.textError}>El campo chasis es necesario</Text>}
        </Item>

        <Item onPress={() => setModalVisible(true)}>
            <Icon style={styles.icon} name='person' />
            <Input placeholderTextColor="black" placeholder="Cliente" value={user.name != undefined ? user.name + " " + user.lastname: ""}  disabled={true} />
            <Icon style={styles.icon} name='add-circle' />
        </Item>
        
        <Item>
            <Icon style={styles.icon} name='color-palette' />
            <Input placeholder="Color" onChangeText={(value) => handleTextChange(value, 'color')} />
            {formError.color && <Text style={styles.textError}>El campo color es necesario</Text>}
        </Item>

        <Item>
            <Icon style={styles.icon} name='car-sport' />
            <Input placeholder="Marca" onChangeText={(value) => handleTextChange(value, 'mark')} />
            {formError.mark && <Text style={styles.textError}>El campo marca es necesario</Text>}
        </Item>

        <Item>
            <Icon style={styles.icon} name='car-sport' />
            <Input placeholder="Modelo" onChangeText={(value) => handleTextChange(value, 'model')} />
            {formError.model && <Text style={styles.textError}>El campo modelo es necesario</Text>}
        </Item>

        <Item>
            <Icon style={styles.icon} name='build' />
            <Input placeholder="Motor" onChangeText={(value) => handleTextChange(value, 'motor')} />
            {formError.motor && <Text style={styles.textError}>El campo motor es necesario</Text>}
        </Item>

        <Item>
            <Icon style={styles.icon} name='qr-code' />
            <Input placeholder="Placa" onChangeText={(value) => handleTextChange(value, 'license')} />
            {formError.license && <Text style={styles.textError}>El campo placa es necesario</Text>}
        </Item>
    </>   
)
}


function FormProperty(props){
    const {handleTextChange, setModalVisible, user, formError} = props;

    return (
        <>
            <Item onPress={() => setModalVisible(true)}>
                <Icon style={styles.icon} name='person' />
                <Input placeholderTextColor="black" placeholder="Cliente" disabled={true} value={user.name != undefined ? user.name + " " + user.lastname: ""} />
                <Icon style={styles.icon} name='add-circle' />
            </Item>

            <Item style={{top: 10}}>
                <Icon style={styles.icon} name='reader' />
                <Input placeholderTextColor="black" placeholder="Descripción" onChangeText={(value) => handleTextChange(value, 'description')}  />
                {formError.description && <Text style={styles.textError}>El campo descripcion es necesario</Text>}
            </Item>
        </>
    )
}

const styles = StyleSheet.create({
    icon: {
        color: 'black',
        fontWeight: 'bold'
    },
    button: {
        height: 50, 
        marginTop: 15,
        width: '95%',
        justifyContent: 'center',
        backgroundColor: '#fec400',
    },
     /* errors*/
     inputError: {
        borderColor: 'red',
        color: 'red'
    },
    textError: {
        color: 'red',
        fontWeight: 'bold'
    }
})