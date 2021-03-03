import React from 'react';
import { Container, Content, Button, ListItem, Text, Icon, Left, Body, Right } from 'native-base';
import { Alert } from 'react-native';


export default function Configuration(props){
    const {navigation} = props;

 const AlertHelp = () =>
    Alert.alert(
      "Ayuda o contacto",
      "para ayuda o soporte por favor contactarnos a los teléfonos: +1 (809) 953-5315 o +1 (809) 728-3526 o a nuestro correo electrónico Devincoderd@gmail.com",
      [
        { text: "CONFIRMAR", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

    return(
    <Container>
        <Content>
          <ListItem icon onPress={() => navigation.navigate("Printer")}>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="print" />
              </Button>
            </Left>
            <Body>
              <Text>Configuración de impresora</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon onPress={() => navigation.navigate("About")}> 
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="information" />
              </Button>
            </Left>
            <Body>
              <Text>Acerca de la aplicación</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon onPress={AlertHelp}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="help" />
              </Button>
            </Left>
            <Body>
              <Text>Ayuda o soporte</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </Content>
      </Container>
    )
}

