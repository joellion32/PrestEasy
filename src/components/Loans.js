import React from 'react';
import { Card, CardItem, Body, Right, Button} from 'native-base';
import {StyleSheet, Text} from 'react-native';
import moment from 'moment'; 
 
export default function Loans(props){  
    const {loans, navigation} = props;
    // format dates 
    const date = moment(loans.date)
    const expiration = moment(loans.expiration)
    const days = expiration.diff(date, "days")   
    return(  
        <Card>
            <CardItem style={styles.cardHeader} header bordered>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>P #{loans.id_loans}-{loans.client.name}</Text>
                <Right>   
                    <Text style={{fontSize: 16, color: '#cacaca'}}>{date.format("ll")}</Text>
                </Right>
            </CardItem>

            <CardItem>  
                <Body style={styles.cardBody}>
                    <Text style={styles.textCash}>${Math.floor(loans.balance)}</Text>
                    <Right>
                    <Button style={styles.button} warning rounded 
                        onPress={() => navigation.navigate("LoansDetail", 
                        {id: loans.id_loans, 
                        loan: loans, 
                        search: loans.client.name,  
                        date: date})}>
                            
                        <Text style={{color: '#fff'}}>Información</Text>
                    </Button>
                    </Right>
                </Body>
            </CardItem>

            <CardItem style={styles.cardFooter} footer>
              <Text style={{fontSize: 15, color: '#cacaca', fontWeight: 'bold'}}>días antes de la fecha límite: </Text>
              <Text style={{fontSize: 15, color: 'red', fontWeight: 'bold'}}>{days} días</Text>
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