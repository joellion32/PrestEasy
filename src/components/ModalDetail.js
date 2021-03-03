import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import { List, ListItem, Content, Right, Left } from 'native-base';
import moment from 'moment';

export default function ModalDetail(props) {
    const { modalVisible, hideModal, dataModal } = props;
    const datebirth = moment(dataModal.datebirth)
    const date = moment(dataModal.date)
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hideModal}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-left"
                            color="black"
                            size={25}
                            onPress={hideModal}
                        />
                        <View style={styles.headerContent}>
                            <Avatar.Icon color="black" size={90} icon="account-circle" />
                            <Text style={styles.textHeader}>{dataModal.name}</Text>
                            <Text style={styles.textHeader}>{dataModal.location}</Text>
                        </View>
                    </View>

                    <Content>
                        <List>
                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Apodo:</Text>
                                </Left>
                                <Right>
                                    <Text style={styles.textBody}>{dataModal.surname != "" ? dataModal.surname : "NO TIENE"}</Text>
                                </Right>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Cedula:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.rnc}</Text>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Teléfono:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.phone}</Text>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Correo electrónico:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.email === "" ? "NO TIENE" : dataModal.email}</Text>
                            </ListItem>

                            {
                                dataModal.active && (
                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Es activo:</Text>
                                        </Left>
                                        <Right>
                                            <Text style={styles.textBody}>{dataModal.active === 1 ? "SI" : "NO"}</Text>
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                dataModal.balance != null &&
                                    (
                                        <ListItem>
                                            <Left>
                                                <Text style={styles.textBody}>Balance:</Text>
                                            </Left>
                                            <Right>
                                                <Text style={styles.textBody}>${dataModal.balance}</Text>
                                            </Right>
                                        </ListItem>
                                    )
                            }
                            {
                                dataModal.credit != null &&
                                (
                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Credito:</Text>
                                        </Left>
                                        <Right>
                                            <Text style={styles.textBody}>${dataModal.credit}</Text>
                                        </Right>
                                    </ListItem>
                                )
                            }

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Género:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.gender === "M" ? "Masculino" : "Femenino"}</Text>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Estado civil:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.state === "S" ? "Soltero/a" : "Casado/a"}</Text>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Ocupación:</Text>
                                </Left>
                                <Text style={styles.textBody}>{dataModal.ocupation != "" ? dataModal.ocupation : "NO TIENE"}</Text>
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={styles.textBody}>Fecha nacimiento:</Text>
                                </Left>
                                <Text style={styles.textBody}>{datebirth.format("ll")}</Text>
                            </ListItem>

                            {
                                dataModal.date && (
                                    <ListItem>
                                        <Left>
                                            <Text style={styles.textBody}>Fecha de registro:</Text>
                                        </Left>
                                        <Text style={styles.textBody}>{date.format("ll")}</Text>
                                    </ListItem>
                                )
                            }
                        </List>
                    </Content>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    header: {
        width: "100%",
        backgroundColor: '#fec400',
        height: 150,
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50
    },
    textHeader: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: '100',
        bottom: 10
    },
    textBody: {
        fontSize: 18
    }
})