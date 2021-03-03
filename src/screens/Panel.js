import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Loans from '../components/Loans';
import { Searchbar } from 'react-native-paper';
import { getData } from '../config/storage';
import { filterItems } from '../config/validation';
import { LSpinner } from '../components/Loading';
import { getDataLoans, getLoansRoutes } from '../services/LoansServices';
import { getTotalClients } from '../services/ClientsService';

export default function Panel(props) {
    const { navigation } = props;
    const [routeName, setRouteName] = useState('');
    const [dataL, setDataL] = useState([])
    const [client, setClient] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setDataL([])
        getData("user").then(uid => {
            getLoans(uid)
            getClients()
        }) 
    }, [])

    // get routes and loans by user  
    const getLoans = (uid) => {
        setLoading(true);
        let arry = [];
        getLoansRoutes(uid).then((resp) => {
        console.log(resp)    
        // route name
        setRouteName(resp.docs[0].data().routeName)  

        // get loans by routes 
          const test = resp.docs.map((documents) => documents.data().loans)[0];
          const loans = test.map((loanId) => getDataLoans(loanId));
    
          Promise.all(loans).then((args) => {
            args.forEach((loan) => {
              const data = loan.data()  
              arry.push({
                id_loans: data.id, 
                term: data.PlazoPrestamo,
                mount: data.MontoPrestamo,
                interest: data.InteresPrestamo,
                client: {
                    id: data.Cliente.IdCliente,
                    name: data.Cliente.Nombre + " " + data.Cliente.Apellido,
                    rnc: data.Cliente.Cedula,
                    location: data.Cliente.Direccion,
                    phone: data.Cliente.Telefono,
                    email: data.Cliente.Email
                },
                search: data.Cliente.Nombre + " " + data.Cliente.Apellido,
                dues: data.cuotas,
                balance: data.BalancePrestamo, 
                date: new Date(data.FechaPrestamo.seconds * 1000), 
                expiration: new Date(data.FechaVencimiento.seconds * 1000) 
              });
            });
            setDataL(arry);
            totalIncome(arry)
            setLoading(false);
          });
        });
      };

    // get total numbers of clients
    const getClients = () => {
        getTotalClients()
            .then(snapshot => {
                let clients = [];
                snapshot.forEach(doc => {
                    clients.push(doc.data())
                });
                setClient(clients)
            })
    }
 
    // get total income
    const totalIncome = (loans) => {
        let total = 0;
        loans.map((dues) => {
            const payment = dues['dues'] 
            payment.forEach((resp) => {
                total += resp.MontoCuota;
            }) 
        })
        setTotal(Math.floor(total))
    }

    // search data 
    const onChangeSearch = (search) => {
        setSearchQuery(search)

        if (dataL == 0 || search == '') {
            getData("user").then(uid => getLoans(uid))
        } else {
            setDataL(filterItems(dataL, search, "search"))
        }
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <View style={styles.header}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.box}>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>General</Text>
                    </View>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.textHeader}>Clientes en portafolio: {client.length}</Text>
                    <Text style={styles.textHeader}>Total ingresos: ${total}</Text>
                    <Text style={styles.textHeader}>{routeName}</Text>
                </View>
            </View>

            <Searchbar
                onChangeText={onChangeSearch}
                value={searchQuery}
                placeholder="Buscar por cliente" />

            <ScrollView>
                <LSpinner loading={loading} />
                { 
                    dataL.length != 0 ?
                    dataL.map((item, index) => (
                        <Loans navigation={navigation} key={index} loans={item} />
                    )) 
                    :
                    <Text style={{textAlign: 'center', fontSize: 18}}>No hay préstamos para mostrar</Text>
                }
            </ScrollView>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fec400',
        height: 180,
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
    headerContent: {
        textAlign: 'left',
        marginTop: 15,
        marginHorizontal: 10
    },
    textHeader: {
        color: 'black',
        fontSize: 20,
        fontWeight: '100'
    }
})