import React, { useEffect, useState } from 'react';
import { Card, CardItem, Body, Right, Button} from 'native-base';
import {StyleSheet, Text} from 'react-native';
import moment from 'moment'; 
import { configData } from '../services/ConfigServices';
 
export default function Dues(props){  
    const {dues, showModal, index} = props;
    // format dates 
    const [latepayment, setLatePayment] = useState(0)
    const date = moment(dues.FechaCuota.seconds * 1000)
    const dateNow = moment(new Date())
    const days = date.diff(dateNow, "days")

    useEffect(() => {
        configData().then(resp => { 
            if (dateNow > date) {
                let latePayment = (dues.BalanceCuota * resp.porciento_mora) / 100;
                const lateP = Math.round(latePayment)
                setLatePayment(lateP)
            } else { 
                setLatePayment(0)
            } 
        })
    }, [])

  
    return(  
        <Card>
            <CardItem style={styles.cardHeader} header bordered>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Cuota #{dues.NumeroCuota}</Text>
                <Right>   
                    <Text style={{fontSize: 16, color: '#cacaca'}}>{date.format("ll")}</Text>
                </Right>
            </CardItem>

            <CardItem>   
                <Body style={styles.cardBody}>
                    <Text style={styles.textCash}>${Math.floor(dues.BalanceCuota)}</Text>
                    <Right>
                    {
                            dues.EstadoPrestamo == "Pagado" ?
                            <Button style={styles.button} warning rounded onPress={() => showModal(dues, date.format("ll"), index, latepayment, 0, "print")}>
                                <Text style={{ color: '#fff' }}>Imprimir</Text>
                            </Button>
                                :
                            <Button style={styles.button} warning rounded onPress={() => showModal(dues, date.format("ll"), index, latepayment, 0, "payment")}>
                                <Text style={{ color: '#fff' }}>Cobrar</Text>
                            </Button>
                    }
                    </Right>
                </Body>
            </CardItem>

            <CardItem style={styles.cardFooter} footer>
              <Text style={{fontSize: 15, color: '#cacaca', fontWeight: 'bold'}}>días antes de la fecha límite: </Text>
              <Text style={[{fontSize: 15, fontWeight: 'bold'}, date > dateNow ? {color: 'green'} : {color: 'red'}]}>{days} días</Text>
            </CardItem>
        </Card> 
    )
}

const styles = StyleSheet.create({
    headerContent:{
        flexDirection: 'row',
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHeader: {
        width: "100%"
    },
    cardBody:{
        flexDirection: 'row',
        justifyContent: 'center',
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
    cardFooter: {
        flexDirection: 'row',
    }
});