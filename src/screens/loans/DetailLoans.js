import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Dues from '../../components/Dues';
import { LSpinner } from '../../components/Loading';
import ModalPayment from '../../components/ModalPayment';
import { charges, getChargesId, getDataLoans, getDuesApi, lastCharges, updateDues } from '../../services/LoansServices';
import dateConfig from '../../config/validation';
import { storeData } from '../../config/storage';
import { configData } from '../../services/ConfigServices';
 
export default function DetailLoans(props) {

    const { route } = props;
    const { id, loan } = route.params;
    const [dues, setDues] = useState([]);
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    const [dataModal, setDataModal] = useState({})
    const [mora, setMora] = useState(0);

    useEffect(() => {
        setDues([])
        getDues()
        storeData("phone", loan.client.phone);
        configData().then(resp => {
            setMora(resp.porciento_mora)
        })
    }, [])

    const getDues = () => {
        setLoading(true)
        getDuesApi(id).then(resp => {
            setLoading(false)
            const data = []
            resp.forEach((doc) => {
                data.push(doc.data().cuotas)
            })
            setDues(data[0])
        })
    }

    // show modal payment 
    const showModal = (due, date, index, latePayment, payment = 0, screen) => {
        setVisible(true)
        setDataModal({
            dues: due,
            index: index,
            id_due: due.id,
            loan: id,
            term: loan.term,
            due: due.NumeroCuota,
            date: date,
            payment: due.BalanceCuota,
            screen: screen,
            client: loan.client,
            latePayment: latePayment,
            total_loan: loan,
            total_payment: payment,
        })
    }

    // update data dues 
    const updateData = (payment, mora, dataModal) => {
        const data = dataModal.dues;
        const totalPayment = Number(payment) + Number(mora);
        const newBalance = data['BalanceCuota'] - payment;
        let estadoCuota = "";

        if (newBalance == 0.00) {
            data['BalanceCuota'] = newBalance;
            data['EstadoPrestamo'] = "Pagado";
            estadoCuota = "Saldo";
        } else {
            data['BalanceCuota'] = newBalance;
            data['EstadoPrestamo'] = "Abono";
            estadoCuota = "Pendiente";
        }

        getDataLoans(dataModal.loan).then(doc => {
            const array = doc.data().cuotas;
            const balancePayment = doc.data().BalancePrestamo - payment;
            array[dataModal.index] = data;

            //update data and save charge
            updateDues(dataModal.loan, array, balancePayment);
            saveCharge(newBalance, estadoCuota, payment, mora, dataModal)
            showModal(dataModal.dues, dataModal.date, dataModal.index, dataModal.latePayment, totalPayment, "print")
        })
    }

    // save charge
    const saveCharge = async (balance, status, totalPayment, mora, _feeData) => {
        const docCharge = charges()
        const receiptId = (await lastCharges()).docs[0].data() 
        const chargeData = (await (await getChargesId(id)).get()).docs
        const prevCharge = []
        let cobroDetalle = []

        console.log(_feeData.total_loan.client)

        chargeData.forEach(doc => {
            prevCharge.push(doc.data())
        })        
 
        // operations variables 
        let receiptNumber = 1;
        let idChargeDetail = 0;
        let cobrodetalleLength = 0;

        if (prevCharge.length != 0) {
            receiptNumber = Number(receiptId['NumeroRecibo']) + 1;
            cobrodetalleLength = prevCharge[prevCharge.length - 1].cobro_detalle.length;

            idChargeDetail = prevCharge[prevCharge.length - 1].cobro_detalle[cobrodetalleLength - 1]["id"] + 1;
        } else {
            idChargeDetail = receiptId["cobro_detalle"][0]["id"] + 1;
        }

        // create data Map
        let detalle = {}
        detalle['BalanceCuota'] = balance;
        detalle['CapitalCuota'] = _feeData.dues['BalanceCapital'];
        detalle['DescuentoCuota'] = 0;
        detalle['EstadoCuota'] = status;
        detalle['FechaCuota'] = _feeData.dues['FechaCuota'];
        detalle['IdCobro'] = (await docCharge).id;
        detalle['IdPrestamo'] =  id;
        detalle['InteresCuota'] = _feeData.dues['InteresCuota'];
        detalle['MontoCuota'] = _feeData.dues['MontoCuota'];
        detalle['MontoPagado'] = totalPayment;
        detalle['MoraCuota'] = mora;
        detalle['NumeroCuota'] = _feeData.dues['NumeroCuota'];
        detalle['id'] = idChargeDetail;
  

        cobroDetalle.push(detalle)

        let newCharge = {
            id: (await docCharge).id,
            NumeroRecibo: receiptNumber.toString(),
            BalanceAnterior: balance,
            DescuentoCobro: 0,
            FechaCobro: `${dateConfig.dateNow}`, 
            IdCliente: _feeData.total_loan.client.id,
            NombreCliente: _feeData.total_loan.client.name,
            MontoCobro: totalPayment,
            IdPrestamo: id,
            PagoAdelantado: 0,
            cobro_detalle: cobroDetalle
        }

        
        const charge = (await docCharge).set(newCharge)
        console.log(charge)
    }

    

    // hide Modal payment
    const hideModal = () => setVisible(false);
    return (
        <SafeAreaView style={{ height: "100%" }}>
            <ModalPayment updateData={updateData} dataModal={dataModal} hideModal={hideModal} visible={visible} />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.textHeader}>Préstamo: #{id}</Text>
                    <Text style={styles.textHeader}>Cédula: {loan.client.rnc}</Text>
                    <Text style={styles.textHeader}>Teléfono: {loan.client.phone}</Text>
                    <Text style={styles.textHeader}>Email: {loan.client.email}</Text>
                    <Text style={styles.textHeader}>Dirección: {loan.client.location}</Text>
                </View>
            </View>


            <ScrollView>
                <LSpinner loading={loading} />

                {
                    dues.map((item, index) => (
                        <Dues showModal={showModal} key={index} dues={item} lastPayment={Number(mora)} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fec400',
        height: 160,
    },
    headerContent: {
        textAlign: 'left',
        marginTop: 10,
        marginHorizontal: 10
    },
    textHeader: {
        color: 'black',
        fontSize: 18,
        fontWeight: '100'
    },
})