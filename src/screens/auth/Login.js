import React from 'react';
import auth from '@react-native-firebase/auth';
import { View, Content, Item, Icon, Input, Button } from 'native-base'; 
import { StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import logo from '../../../assets/Logo.png';
import { useState } from 'react';
import { validateEmail } from '../../config/validation';
import Loading from '../../components/Loading';
import { storeData } from '../../config/storage';

export default function Login(props) {
    const { navigation } = props;
    const [formData, setFormData] = useState({})
    const [formError, setFormError] = useState({})
    const [loading, setLoading] = useState(false)

    const handleTextChange = (value, prop) => {
        setFormData({ ...formData, [prop]: value });
    }

    const Login = () => {
        let errors = {}
        if (!formData.email || !formData.password) {
            if (!formData.email) errors.email = true;
            if (!formData.password) errors.password = true;
        } else if (!validateEmail(formData.email)) {
            errors.email = true;
        }
        else {
            setLoading(true)
            auth().signInWithEmailAndPassword(formData.email, formData.password).then((resp) => {
                console.log(resp)
                setLoading(false)
                // save user uid into storage 
                storeData("user", resp.user.uid) 
                storeData("email", resp.user.email)
                // navigate to panel
                navigation.navigate("Panel")
            }).catch((error) => {
                setLoading(false)
                setFormError({auth: true})
            })
        }

        setFormError(errors)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.image} source={logo} />
            </View>

            <View style={styles.content}>
                <Text style={styles.text}>Bienvenido</Text>
                <Text style={styles.text}>Inicia sesión para continuar</Text>
            </View>


            <Content style={styles.content}>
                <Item style={[styles.item, formError.email && styles.inputError]}>
                    <Icon style={[styles.icon, formError.email && styles.inputError]} name='mail' />
                    <Input
                        onChangeText={(value) => handleTextChange(value, "email")}
                        placeholderTextColor="#fde6a3"
                        style={styles.input}
                        placeholder='Correo electrónico' />
                        {formError.email && <Text style={styles.textError}>Email inválido</Text>}
                </Item>
 

                <Item style={[styles.item, formError.password && styles.inputError]}>
                    <Icon style={[styles.icon, formError.password && styles.inputError]} name='lock-closed' />
                    <Input
                        onChangeText={(value) => handleTextChange(value, "password")}
                        placeholderTextColor="#fde6a3"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder='Contraseña' />
                </Item>

                {formError.auth && <Text style={[styles.textError, {marginTop: 8}]}>Email o contraseña incorrectos</Text>}

                <View style={styles.footer}>
                    
                    <Button style={styles.button} block onPress={Login}>
                        <Text style={{ color: '#fec400', fontSize: 20, fontWeight: 'bold' }}>Acceder</Text>
                    </Button>

                    <View style={{ marginTop: 10, alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: -35 }} onPress={() => navigation.navigate("ResetEmail")}>
                            <Text style={styles.text2}>¿Has olvidado tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*Loading*/}
                <Loading loading={loading}/>
            </Content>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fec400',
        flex: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    image: {
        width: 300,
        height: 125,
        backgroundColor: "#fff",
        borderRadius: 20
    },
    content: {
        width: "100%",
        marginHorizontal: 25,
        marginTop: 30
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 25,
        color: '#fff',
    },
    text2: {
        marginTop: 5,
        fontSize: 20,
        color: '#fff'
    },
    icon: {
        color: '#fff',
        fontWeight: 'bold'
    },
    item: {
        borderColor: 'black',
        marginVertical: 10,
        width: "90%"
    },
    input: {
        fontSize: 23,
        color: "#fff",
    },
    button: {
        width: "90%",
        height: 60,
        backgroundColor: "#fff",
        marginTop: 4
    },
    /* errors*/
    inputError: {
        borderColor: 'red',
        color: 'red'
    },
    textError: {
        bottom: 20,
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold'
    }
})