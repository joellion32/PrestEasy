import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {Text, StyleSheet, View} from 'react-native';
import { Drawer, Avatar} from 'react-native-paper';
import { getData, removeValue } from '../config/storage';

export function DrawerContent(props) {
    const {navigation} = props;
    const [active, setActive] = useState('Panel')
    const [user, setUser] = useState({})

    // view user profile in drawer navigation
    useEffect(() => {
        getData("email").then(email => {
            let user = {
               letter: email.charAt(0), 
               name: 'Cobrador',
               email: email, 
            }
            setUser(user)
        })
    }, [])



    const onChangeScreen = (screen) => {
        setActive(screen)
        navigation.navigate(screen)
    }

    // logout user
    const logout = () => {
        auth().signOut().then(() => {
            navigation.closeDrawer();
            removeValue("user")
            navigation.navigate("Login")
        })
    }
 

    return (
        <>
        <View style={styles.header}>
            <View style={styles.avatar}>
                <Avatar.Text style={{backgroundColor: "#fff"}} color="#458fdb" size={100} label={user.letter} />
                    <View style={{marginTop: 8}}>
                        <Text style={styles.text}>{user.name}</Text>
                        <Text style={styles.text}>{user.email}</Text>
                    </View>
            </View>
        </View>

        <DrawerContentScrollView>
            <Drawer.Section>
                <Drawer.Item 
                    icon="home"  
                    style={styles.item}
                    label="Préstamos"
                    active={active === "Panel"}
                    onPress={() => onChangeScreen('Panel')}
                />
  
            
                <Drawer.Item
                    icon="account-group"   
                    style={styles.item}
                    label="Clientes"
                    active={active === "Clients"}
                    onPress={() => onChangeScreen('Clients')}
                />    

                <Drawer.Item
                    icon="account-multiple-plus"   
                    style={styles.item}
                    label="Garantes"
                    active={active === "Guarantors"}
                    onPress={() => onChangeScreen('Guarantors')}
                />    

                <Drawer.Item
                    icon="home-currency-usd"
                    style={styles.item}
                    label="Objetos en renta"
                    active={active === "Rents"}
                    onPress={() => onChangeScreen('Rents')}
                 />    


                <Drawer.Item
                    icon="cash"   
                    style={styles.item}
                    label="Pago capital"
                    active={active === "Capital"}
                    onPress={() => onChangeScreen('Capital')}
                />


                  <Drawer.Item
                    icon="currency-usd"   
                    style={styles.item}
                    label="Cuadre de cobrador"
                    active={active === "Collector"}
                    onPress={() => onChangeScreen('Collector')}
                />      

                <Drawer.Item
                    icon="cog"   
                    style={styles.item}
                    label="Configuración"
                    active={active === "Settings"}
                    onPress={() => onChangeScreen('Settings')}
                />    
            </Drawer.Section>

            <Drawer.Section>
            <Drawer.Item
                    icon="login-variant"     
                    style={styles.item} 
                    label="Cerrar sesión"
                    onPress={logout}
                />  
            </Drawer.Section>

        </DrawerContentScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fec400',
        height: '31%',
    }, 
    avatar: {
        flex: 1,
        marginTop: 35,
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
    item:{
        height: 45,
        justifyContent: 'center',
        borderRadius: 15
    }
})