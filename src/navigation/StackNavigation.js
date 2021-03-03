import React from 'react';
import { Icon } from 'native-base';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Panel from '../screens/Panel';
import DetailLoans from '../screens/loans/DetailLoans';
import Clients from '../screens/clients/Clients';
import Guarantors from '../screens/clients/Guarantors';
import CreateClients from '../screens/clients/CreateClients';
import Debtcollector from '../screens/collector/Debtcollector';
import RegisterLoans from '../screens/loans/RegisterLoans';
import Rents from '../screens/rents/Rents';
import CreateRents from '../screens/rents/CreateRents';
import Capital from '../screens/capital/Capital';
import { getData } from '../config/storage';
import Configuration from '../screens/configuration/configurationPanel';
import About from '../screens/configuration/About';
import Printer from '../screens/configuration/Printer';

const Stack = createStackNavigator();

export default function StackNavigation(props) {
    const { navigation } = props;

    /* BUTTONS TOOLBAR */
    const buttonLeft = (screen) => {
       if(screen == "back-screen"){
        return (
            <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => navigation.goBack()}>
                <Icon name='arrow-back' />
            </TouchableOpacity>
        )
       }else{
        return (
            <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => navigation.openDrawer()}>
                <Icon name='menu' />
            </TouchableOpacity>
        )
       }
    }

    const buttonRigth = (icon, route, title) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(route, {title: title})} style={{ marginHorizontal: 8 }}>
                <Icon name={icon} />
            </TouchableOpacity>
        )
    }

    const call = () => {
        return (
            <TouchableOpacity onPress={exeCall}>
                <Icon name="call" />
            </TouchableOpacity>
        )
    }

    // ejecutar llamada
    const exeCall = async () => {
        let phoneNumber = await getData("phone")
        Linking.openURL(`tel:${phoneNumber}`)    
    }

    /* BUTTONS TOOLBAR */
    return (
        <Stack.Navigator>
        <Stack.Screen name="Panel" component={Panel} 
            options={{ title: "Préstamos", headerTitleAlign: 'center', 
            headerLeft: () => buttonLeft("Panel"), 
            headerRight: () => buttonRigth('create', "RegisterLoans"), 
            headerStyle: styles.toolbar }} />

        <Stack.Screen name="LoansDetail" component={DetailLoans} 
            options={({ route }) => ({ title: route.params.search , headerTitleAlign: 'center', 
            headerLeft: () => buttonLeft("back-screen"), 
            headerRight: () => call(), 
            headerStyle: styles.toolbar })} />

        <Stack.Screen name="RegisterLoans" component={RegisterLoans} 
            options={{ title: "Registrar Prestamos" , headerTitleAlign: 'center', 
            headerLeft: () => buttonLeft("back-screen"), 
            headerStyle: styles.toolbar }} />

        <Stack.Screen name="Clients" component={Clients}
            options={{title: "Clientes", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Clients"),
            headerRight: () => buttonRigth("person-add", "CreateClients", "Crear cliente"),
            headerStyle: styles.toolbar}} />

        <Stack.Screen name="Rents" component={Rents}
            options={{title: "Objetos en renta", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Rents"),
            headerRight: () => buttonRigth("create", "CreateRents"),
            headerStyle: styles.toolbar}} />

        <Stack.Screen name="CreateRents" component={ CreateRents }
            options={{title: "Crear objeto en renta", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("back-screen"),
            headerStyle: styles.toolbar}} />

        <Stack.Screen name="CreateClients" component={CreateClients} 
            options={({ route }) => ({ title: route.params.title, headerTitleAlign: 'center', 
            headerLeft: () => buttonLeft("back-screen"), 
            headerStyle: styles.toolbar })} />
            
        <Stack.Screen name="Guarantors" component={Guarantors}
            options={{title: "Garantes", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Guarantors"),
            headerRight: () => buttonRigth("person-add", "CreateClients", "Crear garante"),
            headerStyle: styles.toolbar}} />

            <Stack.Screen name="Collector" component={Debtcollector}
            options={{title: "Cuadre del cobrador", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Collector"),
            headerStyle: styles.toolbar}} />

            <Stack.Screen name="Capital" component={Capital}
            options={{title: "Pago capital", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Capital"),
            headerStyle: styles.toolbar}} />

           <Stack.Screen name="Settings" component={Configuration}
            options={{title: "Configuración", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("Settings"),
            headerStyle: styles.toolbar}} />

            <Stack.Screen name="About" component={About}
             options={{ headerShown: false }}
            />

            <Stack.Screen name="Printer" component={Printer}
            options={{title: "Configuración de impresora", headerTitleAlign: 'center',
            headerLeft: () => buttonLeft("back-screen"),
            headerStyle: styles.toolbar}} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#fec400',
        shadowColor: 'transparent',
        elevation: 0,
    },
    title: {
        textAlign: "center",
    }
})