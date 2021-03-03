import React, { useState } from 'react';
import { Item, Icon, Input, Form, Picker, DatePicker } from 'native-base';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { validateEmail } from '../../config/validation';
import { ScrollView } from 'react-native-gesture-handler';
import { saveClients, saveGuarantors } from '../../services/ClientsService';
import ButtonAndroid from '../../components/Button';

export default function CreateClients(props) {
    const {route, navigation} = props;
    const [formError, setFormError] = useState({})
    const {title} = route.params;
    const [formData, setFormData] = useState({
        status: "S",
        gender: "M"
    })


    const handleTextChange = (value, prop) => {
        setFormData({ ...formData, [prop]: value });
    }
 
    // save data user 
    const saveData = () => {
        let errors = {}

            if (!formData.name) errors.name = true;
            if (!formData.lastname) errors.lastname = true;
            if (!formData.datebirth) errors.datebirth = true;
            if (!formData.rnc) errors.rnc = true;
            if (!formData.phoneC) errors.phoneC = true;
            if (!formData.location) errors.location = true;
         else if (!validateEmail(formData.email)) {
            errors.email = true;
        } else {
            if (title === "Crear cliente") {
                saveClients(formData).then(resp => {
                    navigation.navigate("Clients", { post: true })
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                saveGuarantors(formData).then(resp => {
                    navigation.navigate("Guarantors", { post: true })
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
        setFormError(errors)
    }

    return (
        <SafeAreaView style={{height: '100%'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Form>
                    <Item style={[formError.name && styles.inputError]}>
                        <Icon style={styles.icon} name='person' />
                        <Input onChangeText={(value) => handleTextChange(value, 'name')} placeholder="Nombre" />
                        {formError.name && <Text style={styles.textError}>El campo nombre es necesario</Text>}
                    </Item>
                    <Item style={[formError.lastname && styles.inputError]}>
                        <Icon style={styles.icon} name='person' />
                        <Input onChangeText={(value) => handleTextChange(value, 'lastname')} placeholder="Apellido" />
                        {formError.lastname && <Text style={styles.textError}>El campo apellido es necesario</Text>}
                    </Item>
                    <Item>
                        <Icon style={styles.icon} name='person' />
                        <Input onChangeText={(value) => handleTextChange(value, 'surname')} placeholder="Apodo" />
                    </Item>
                    <Item picker fixedLabel>
                        <Icon style={styles.icon} name='people' />

                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Sexo"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={formData.gender}
                            onValueChange={(value) => handleTextChange(value, "gender")}
                        >
                            <Picker.Item label="Masculino" value="M" />
                            <Picker.Item label="Femenino" value="F" />
                        </Picker>
                    </Item>
                    <Item picker fixedLabel>
                        <Icon style={styles.icon} name='people' />

                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Estado civil"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={formData.status}
                            onValueChange={(value) => handleTextChange(value, "status")}
                        >
                            <Picker.Item label="Soltero" value="S" />
                            <Picker.Item label="Casado" value="C" />
                            <Picker.Item label="Unión Libre" value="U" />
                        </Picker>
                    </Item>
                    <Item picker fixedLabel style={[formError.datebirth && styles.inputError]}>
                        <Icon style={styles.icon} name='calendar' />

                        <DatePicker
                            defaultDate={new Date()}
                            locale={"es"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            placeHolderText="Fecha de nacimiento"
                            textStyle={{ color: "green" }}
                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                            onDateChange={(value) => handleTextChange(value, "datebirth")}
                            disabled={false}
                        />
                        {formError.datebirth && <Text style={styles.textError}>La fecha de nacimiento es requerida</Text>}
                    </Item>
                    <Item>
                        <Icon style={styles.icon} name='briefcase' />
                        <Input onChangeText={(value) => handleTextChange(value, 'ocupation')} placeholder="Ocupación" />
                    </Item>

                    <Item style={[formError.email && styles.inputError]}>
                        <Icon style={styles.icon} name='mail' />
                        <Input onChangeText={(value) => handleTextChange(value, 'email')} placeholder="Correo electrónico" />
                        {formError.email && <Text style={styles.textError}>El correo electronico es incorrecto</Text>}
                    </Item>
                    <Item style={[formError.rnc && styles.inputError]}>
                        <Icon style={styles.icon} name='card' />
                        <Input onChangeText={(value) => handleTextChange(value, 'rnc')} placeholder="Cédula o pasaporte" />
                        {formError.rnc && <Text style={styles.textError}>La cédula es requerida</Text>}
                    </Item>
                    <Item style={[formError.phoneC && styles.inputError]}>
                        <Icon style={styles.icon} name='phone-portrait' />
                        <Input onChangeText={(value) => handleTextChange(value, 'phoneC')} keyboardType="phone-pad" placeholder="Teléfono celular" />
                        {formError.phoneC && <Text style={styles.textError}>El numero de teléfono es requerido</Text>}
                    </Item>
                    <Item>
                        <Icon style={styles.icon} name='call' />
                        <Input onChangeText={(value) => handleTextChange(value, 'phoneR')} keyboardType="phone-pad" placeholder="Teléfono residencia" />
                    </Item>

                    <Item>
                        <Icon style={styles.icon} name='call' />
                        <Input onChangeText={(value) => handleTextChange(value, 'phoneO')} keyboardType="phone-pad" placeholder="Teléfono oficina" />
                    </Item>

                    <Item style={[formError.location && styles.inputError]}>
                        <Icon style={styles.icon} name='location' />
                        <Input onChangeText={(value) => handleTextChange(value, 'location')} placeholder="Dirección" />
                        {formError.location && <Text style={styles.textError}>La dirección es necesaria</Text>}
                    </Item>

                    <Item>
                        <Icon style={styles.icon} name='location' />
                        <Input onChangeText={(value) => handleTextChange(value, 'locationJob')} placeholder="Dirección trabajo" />
                    </Item>

                    <Item>
                        <Icon style={styles.icon} name='eye' />
                        <Input onChangeText={(value) => handleTextChange(value, 'observation')} placeholder="Observación" />
                    </Item>
                </Form>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <ButtonAndroid onPress={saveData} />
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    item: {
        borderColor: 'white',
        marginVertical: 10,
        width: "90%"
    },
    input: {
        fontSize: 23,
        color: "#fff",
    },
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