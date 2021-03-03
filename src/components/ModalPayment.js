import { Right, Left, CheckBox } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, TextInput } from 'react-native-paper';
import moment from 'moment';
import { configData } from '../services/ConfigServices';
import validation from '../config/validation'; 

export default function ModalPayment(props) {
    const { visible, hideModal, dataModal, updateData } = props;
    return (
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={visible}
                onRequestClose={hideModal}
            >
                {
                    dataModal.screen === "payment" ?

                        <View style={[styles.container, styles.modalBackgroundStyle, { paddingTop: 40 }]}>
                            <ModalPayments updateData={updateData} hideModal={hideModal} dataModal={dataModal} />
                        </View>
                        :
                        <View style={[styles.container, styles.modalBackgroundStyle, { paddingTop: 10 }]}>
                            <ModalPrint dataModal={dataModal} />
                        </View>
                }

            </Modal>
        </View>
    )
}

export function ModalPayments(props) {
    const { hideModal, dataModal, updateData } = props;
    const [error, setError] = useState(false)
    const [payment, setPayment] = useState(0)
    const [totalPayment, setTotalPayment] = useState(0)
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [mora, setMora] = useState(0)


    // change the total payment according to the change of checkBox
    useEffect(() => {
        if (checked1 && checked2 || checked2 && checked1) {
            setPayment(dataModal.payment + dataModal.latePayment)
        } else if (checked1) {
            setPayment(0)
        }
        else if (checked2) {
            setPayment(dataModal.payment)
        } else if (checked3 && checked1) {
            setPayment(dataModal.payment + dataModal.latePayment)
        } else if (checked3) {
            setPayment(dataModal.payment)
        }
    }, [checked1, checked2, checked3])


    // set checked status
    const setCheckedStatus = (status) => {
        if (status === "primary") {
            setChecked1(!checked1)
            setMora(dataModal.latePayment)
        } else if (status === "secondary") {
            setChecked2(!checked2)
            setChecked3(false)
            setTotalPayment(dataModal.payment)
            setMora(0)
        } else if (status === "tertiary") {
            setChecked3(!checked3)
            setChecked2(false)
            setTotalPayment(0)
            setMora(0)
        }
    }


    // complete payment 
    const completePayment = () => {
        if (payment > dataModal.payment) {
            setTotalPayment(dataModal.payment)
        } else if (totalPayment > 0) {
            setTotalPayment(payment)
        }

        if (totalPayment == 0) {
            setError(true)
        } else {
            setError(false)
            Alert.alert(
                "¿Desea confirmar el pago?",
                "",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Confirmar", onPress: () => updateData(totalPayment, mora, dataModal) }
                ],
                { cancelable: false }
            );
        }
    }


    return (
        /*---MODAL PAYMENT---*/
        <View style={styles.paymentContainer}>
            <View style={{ alignItems: 'center' }}>
                <Avatar.Icon color="#ffa900" style={styles.logo} size={130} icon="wallet" />
                <Text style={styles.textHeader}>{error ? "No se puede completar el pago" : "Completar pago"}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.text, { marginTop: 20, marginHorizontal: 15 }]}>Prestamo #{dataModal.loan}</Text>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.text, { marginHorizontal: 15 }]}>Cuota #{dataModal.due}</Text>
                    <Right>
                        <Text style={[styles.text, { color: '#cacaca', marginHorizontal: 5 }]}>{dataModal.date}</Text>
                    </Right>
                </View>

                <View style={{ top: 5 }}>

                    <Text style={styles.textTitle}>Mora:</Text>

                    <View style={styles.content}>
                        <CheckBox style={styles.checkbox} color="#449f4f" checked={checked1} onPress={() => setCheckedStatus("primary")} />
                        <Text style={[styles.text, { color: 'red', marginHorizontal: 20 }]}>${dataModal.latePayment}</Text>
                    </View>

                    <Text style={styles.textTitle}>Monto a pagar:</Text>

                    <View style={styles.content}>
                        <CheckBox style={styles.checkbox} color="#449f4f" checked={checked2} onPress={() => setCheckedStatus("secondary")} />
                        <Text style={[styles.text, { color: 'red', top: -1, marginHorizontal: 20 }]}>${Math.floor(dataModal.payment)}</Text>
                    </View>

                    <Text style={styles.textTitle}>Pago parcial:</Text>

                    <View style={styles.content}>
                        <CheckBox style={styles.checkbox} color="#449f4f" checked={checked3} onPress={() => setCheckedStatus("tertiary")} />
                        <Text style={[styles.text, { color: 'gray', top: -1, marginHorizontal: 20 }]}>Monto a abonar</Text>
                    </View>

                    {
                        checked3 &&
                        <View style={{ alignItems: 'center' }}>
                            <TextInput
                                onChangeText={(value) => setTotalPayment(value)}
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Monto a pagar" />
                            {totalPayment > payment && <Text style={{ color: 'red' }}>El monto rebasa la cuota a pagar</Text>}
                        </View>
                    }

                    {
                        checked3 ? (
                            <View>
                                <Text style={styles.textPayment}>Balance: ${Math.floor(payment)}</Text>
                                <Text style={styles.textPayment}>A pagar: ${totalPayment}</Text>
                            </View>
                        ) :
                            checked2 && <Text style={styles.textPayment}>Total: ${payment}</Text>
                    }
                </View>

                <View style={styles.footer}>
                    <Left>
                        <TouchableOpacity style={[styles.buttonModal, {backgroundColor: '#ff9e01'}]} onPress={hideModal}>
                            <Text style={styles.textButton}>Cancelar</Text>
                        </TouchableOpacity>
                    </Left>

                    {
                        checked1 && checked2 || checked3 || checked2 ?
                            (
                                <Right>
                                    <TouchableOpacity style={[styles.buttonModal, {backgroundColor: '#ff9e01'}]} onPress={completePayment}>
                                        <Text style={styles.textButton}>Pagar</Text>
                                    </TouchableOpacity>
                                </Right>
                            )
                            : checked1 ? (
                                <Right>
                                    <TouchableOpacity style={[styles.buttonModal, {backgroundColor: '#d3d3d3'}]}>
                                            <Text style={styles.textButton}>Pagar</Text>
                                    </TouchableOpacity>
                                </Right>
                            ) 
                        :
                        (
                            <Right>
                                <TouchableOpacity style={[styles.buttonModal, { backgroundColor: '#d3d3d3' }]}>
                                        <Text style={styles.textButton}>Pagar</Text>
                                </TouchableOpacity>
                            </Right>
                        )
                    }

                </View>
            </ScrollView>
        </View>
    )
}

export function ModalPrint(props) {
    const { dataModal } = props;
    const dateNow = new Date();
    const expiration = new Date(dataModal.dues.FechaCuota.seconds * 1000);
    const [company, setCompay] = useState({});
    const totalDue = dataModal.dues.InteresCuota + dataModal.dues.BalanceCapital;

    useEffect(() => {
        configData().then(resp => {
            setCompay(resp)
        })
    }, [])

    // imprimir recibo
    const PrintPage = () => {
        console.log("Imprimir")
    }

    return (
        /*---MODAL PRINT---*/
        <View style={styles.printContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.headerModal, {marginTop: 30}]}>
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
                        <Text>Prestamo:</Text>
                        <Right>
                            <Text>#{dataModal.loan}</Text>
                        </Right>
                    </View>
                    <View style={styles.bodyModal}>
                        <Text>Cedula:</Text>
                        <Right>
                            <Text>{dataModal.client.rnc}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Nombre:</Text>
                        <Right>
                            <Text>{dataModal.client.name}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Dirección:</Text>
                        <Right>
                            <Text>{dataModal.client.location}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>No. contacto:</Text>
                        <Right>
                            <Text>{dataModal.client.phone}</Text>
                        </Right>
                    </View>
                    <Text style={{ textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

                    <View style={styles.bodyModal}>
                        <Text>Fecha vencimiento:</Text>
                        <Right>
                            <Text>{moment(expiration).format('ll')}</Text>
                        </Right>
                    </View>
                    <View style={styles.bodyModal}>
                        <Text>No. cuota:</Text>
                        <Right>
                            <Text>{dataModal.dues.NumeroCuota}/{dataModal.term}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Interés:</Text>
                        <Right>
                            <Text>${dataModal.dues.InteresCuota}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Capital:</Text>
                        <Right>
                            <Text>${parseFloat(dataModal.dues.BalanceCapital)}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Mora:</Text>
                        <Right>
                            <Text>${dataModal.latePayment}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Total cuota:</Text>
                        <Right>
                            <Text>${totalDue}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Total pagado:</Text>
                        <Right>
                            <Text>{ dataModal.total_payment > 0 ? "$" + dataModal.total_payment : "$" + totalDue}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Pediente cuota:</Text>
                        <Right>
                            <Text>${Math.floor(dataModal.dues.BalanceCuota)}</Text>
                        </Right>
                    </View>
                    <Text style={{ textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                    <View style={styles.bodyModal}>
                        <Text>Balance pendiente:</Text>
                        <Right>
                            <Text>${Math.floor(dataModal.total_loan.balance)}</Text>
                        </Right>
                    </View>

                    <View style={styles.bodyModal}>
                        <Text>Monto solicitado:</Text>
                        <Right>
                            <Text>${dataModal.total_loan.mount}</Text>
                        </Right>
                    </View>
                    <Text style={{ textAlign: 'center' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                </View>
            </ScrollView>

            <TouchableOpacity onPress={PrintPage} style={styles.buttonPrint}>
                <Text>IMPRIMIR</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    headerModal: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    bodyModal: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    paymentContainer: {
        width: 320,
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 10
    },
    printContainer: {
        width: 300,
        height: 620,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    textTitle: {
        fontSize: 15,
        top: 15,
        marginHorizontal: 40
    },
    logo: {
        marginTop: -70,
        backgroundColor: 'black',
    },
    textHeader: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 20,
        fontWeight: '100'
    },
    checkbox: {
        borderRadius: 50,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 10
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        justifyContent: 'center',
    },
    input: {
        height: 30,
        width: '80%',
    },
    buttonPrint: {
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#fec400',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    buttonModal: {
        marginHorizontal: 30,
        width: '75%',
        height: 40,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    textPayment: {
        color: 'red',
        fontSize: 17,
        marginHorizontal: 15,
        top: 10
    }
})