import React from 'react';
import { Card, Right, Left, Button, ListItem, List, Body } from 'native-base';
import { Avatar } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';
import moment from 'moment';


export default function ListUsers(props) {
    const { client, showModalDetail } = props;
    const date = moment(client.date)

    return (
        <Card style={styles.card}>
            <List>
                <ListItem avatar noBorder>
                    <Left>
                        <Avatar.Icon size={60} icon="account-circle" />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' }}>{client.name}</Text>
                        <Text style={{ fontSize: 18, color: '#cacaca' }}>{date.format("ll")}</Text>
                    </Body>
                    <Right>
                        <Button style={styles.button} warning rounded
                            onPress={() => showModalDetail(client)}>

                            <Text style={{ color: '#fff' }}>Información</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
        </Card>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        top: 10
    },
    card: {
        paddingVertical: 20,
        justifyContent: 'center'
    }
});