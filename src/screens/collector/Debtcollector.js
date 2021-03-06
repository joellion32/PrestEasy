import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Modal, TouchableOpacity, Image } from 'react-native';
import { Item, Icon, Button, Card, CardItem, Right, Body, List, ListItem } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import { collectorDates, getCollector } from '../../services/DataService';
import dateConfig from '../../config/validation';
import { FAB } from 'react-native-paper';
import moment from 'moment';
import validation from '../../config/validation';
import { configData } from '../../services/ConfigServices';

export default function Debtcollector() {
    const [collectors, setCollectors] = useState([])
    const [dateI, setDateI] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getCollectors()
    }, [])


    // get loans by dateNow
    const getCollectors = () => {
        getCollector().then(resp => {
            let array = []
            resp.forEach(doc => {
                array.push(doc.data())
            })
            setCollectors(array)
            totalRecauded(array)
        })
    }

    // search loans by dates 
    const searchCollector = () => {
        const date1 = moment(dateI).format('Y/M/D')
        const date2 = moment(dateEnd).format('Y/M/D')

        collectorDates(date1, date2).then(resp => {
            resp.forEach(doc => {
                let array = []
                resp.forEach(doc => {
                    array.push(doc.data())
                })
                setCollectors(array)
                totalRecauded(array)
            })
        })
    }

    // show modal print
    const showModal = (status) => {
        if (status == true) {
            setModalVisible(true)
        } else {
            setModalVisible(false)
        }
    }


    // get total income
    const totalRecauded = (collectors) => {
        let total = 0;
        collectors.forEach((resp) => {
            total += Number(resp.MontoCobro);
        }) 

        setTotal(Math.floor(total))
    }



    return (
        <SafeAreaView style={{ height: '100%' }}>
            <ModalPrint total={total} visible={modalVisible} showModal={showModal} collectors={collectors} />

            <View style={styles.header}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.box}>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>Ultimos cobros</Text>
                        <Text style={{ color: "#fec400", fontSize: 18 }}>{dateConfig.dateNow}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Item style={{ borderColor: 'black' }} picker fixedLabel>
                        <Icon style={{ color: 'black' }} name='calendar' />
                        <DatePicker
                            mode="date"
                            format="YYYY-MM-DD"
                            date={dateI}
                            style={{width: '90%', backgroundColor: '#fec400', fontSize: 20}}
                            locale={"es"}
                            androidMode={"default"}
                            placeHolderText="Fecha desde"
                            textStyle={{ color: "green" }}
                            placeHolderTextStyle={{ color: "black" }}
                            onDateChange={(value) => setDateI(value)}
                            disabled={false}
                        />
                    </Item>

                    <Item style={{ borderColor: 'black' }} picker fixedLabel>
                        <Icon style={{ color: 'black' }} name='calendar' />
                        <DatePicker
                            style={{width: '90%', backgroundColor: '#fec400', fontSize: 20}}
                            date={dateEnd}
                            mode="date"
                            format="YYYY-MM-DD"
                            placeHolderText="Fecha hasta"
                            textStyle={{ color: "green" }}
                            placeHolderTextStyle={{ color: "black" }}
                            onDateChange={(value) => setDateEnd(value)}
                            disabled={false}
                        />
                    </Item>

                    <Button onPress={() => searchCollector()} block style={{ top: 10, backgroundColor: '#fac411' }}>
                        <Text style={{ color: 'white' }}>Buscar</Text>
                    </Button>
                </View>
            </View>


            <ScrollView>
                {
                    collectors.length != 0 ?
                        collectors.map((item, index) => (
                            <ListCollector data={item} key={index} />
                        ))
                        :
                        <Text style={{ textAlign: 'center', fontSize: 18, top: 50, height: 200 }}>No se ha registrado ningún pago</Text>
                }
            </ScrollView>

            {
                collectors.length != 0 &&
                <FAB
                style={styles.fab}
                icon="printer"
                onPress={() => showModal(true)}
            />

            }
        </SafeAreaView>
    )
}

function ListCollector(props) {
    const { data } = props;
    const date = moment(data.FechaCobro)
    return (
        <Card>
            <CardItem style={styles.cardHeader} header bordered>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>P #{data.IdPrestamo} {data.NombreCliente}</Text>
                <Right>
                    <Text style={{ fontSize: 18, color: '#cacaca' }}>{date.format('ll')}</Text>
                </Right>
            </CardItem>

            <CardItem>
                <Body style={styles.cardBody}>
                    <Text style={styles.textCash}>Balance ${data.MontoCobro}</Text>
                </Body>
            </CardItem>

            <CardItem footer></CardItem>
        </Card>
    )
}

/*MOSTRAR VENTANA DE IMPRESION*/
export function ModalPrint(props) {
    const { visible, collectors, showModal, total } = props;    
    const dateNow = new Date();
    const [company, setCompay] = useState({});

    useEffect(() => {
        configData().then(resp => {
            setCompay(resp)
        })
    }, [])

    return (
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={visible}
                onRequestClose={() => showModal(false)}
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
                                        <Text>#{validation.receipt}</Text>
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
                                    <Text>Préstamos</Text>
                                </View>

                                <List>
                                    {
                                        collectors.map((item, index) => (
                                            <ListItem key={index} avatar>
                                                <Body>
                                                    <Text>P# {item.IdPrestamo} {item.NombreCliente} </Text>
                                                    <Text>{moment(item.FechaCobro).format('ll')}</Text>
                                                </Body>
                                                <Right>
                                                    <Text note>${item.MontoCobro}</Text>
                                                </Right>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                                <Text style={{ textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                                <View style={styles.bodyModal}>
                                    <Text>Total:</Text>
                                    <Right>
                                        <Text>${total}</Text>
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    header: {
        backgroundColor: '#fec400',
        height: 230,
    },
    box: {
        marginTop: 15,
        backgroundColor: 'black',
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    content: {
        marginHorizontal: 15,
        top: 15
    },
    cardHeader: {
        width: "100%"
    },
    cardBody: {
        flexDirection: 'row',
        top: 10
    },
    button: {
        width: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCash: {
        color: '#fea904',
        fontWeight: 'bold',
        fontSize: 30
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
    },
    headerModal: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
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