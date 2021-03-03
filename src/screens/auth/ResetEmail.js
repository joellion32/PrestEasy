import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import { View, Content, Item, Icon, Input, Button } from 'native-base';
import { StyleSheet, Image, Text, Alert } from 'react-native';
import { validateEmail } from '../../config/validation';
import logo from '../../../assets/Logo.png';
import Loading from '../../components/Loading';


export default function ResetEmail(props) {

    const { navigation } = props;
    const [formData, setFormData] = useState({})
    const [formError, setFormError] = useState({})
    const [loading, setLoading] = useState(false)

    // validate email
    const resetEmail = () => {
        let errors = {}
        if(!formData.email){
            errors.email = true;
        }else if(!validateEmail(formData.email)){
            errors.email = true;  
        }else{
            setLoading(true)
            auth().sendPasswordResetEmail(formData.email).then(() => {
                setLoading(false)
                createAlert("Se ha enviado un mensaje a su correo electrónico para restablecer la contraseña.")
            }).catch(() => {
                setLoading(false)
                createAlert("Ha ocurrido un error por favor intente mas tarde")
            })
        }

        setFormError(errors)
    }

    // show alert
    const createAlert = (message) =>
    Alert.alert(
      "Alerta",
      `${message}`,
      [
        { text: "Continuar", onPress: () => navigation.navigate("Login") }
      ],
      { cancelable: false }
    );


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.image} source={logo} />
            </View>

            <View style={styles.content}>
                <Text style={styles.text}>Restablecer contraseña</Text>
            </View>

            <Content style={[styles.content, styles.form]}>
                <Item style={[styles.item, formError.email && styles.inputError]}>
                    <Icon style={[styles.icon, formError.email && styles.inputError]} name='mail' />
                    <Input
                        onChangeText={(value) => setFormData({...formData, email: value})}
                        placeholderTextColor="#fde6a3"
                        style={styles.input}
                        placeholder='Correo electrónico' />
                        {formError.email && <Text style={styles.textError}>Email inválido</Text>}
                </Item>

                <View style={styles.footer}>
                    <Button style={styles.button} block onPress={resetEmail}>
                        <Text style={{ color: '#fec400', fontSize: 20, fontWeight: 'bold' }}>Confirmar</Text>
                    </Button>
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
        color: "#fff"
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