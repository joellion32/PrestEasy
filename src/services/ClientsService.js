import firestore from '@react-native-firebase/firestore';

const db = firestore()

// get clients 
export async function clients(){
    return await db.collection("clients").doc()
}

export async function getTotalClients(){
    return await db.collection("clients").get();
}

export async function getTotalGuarantors(){
    return await db.collection("guarantors").get();
}

// save client 
export async function saveClients(data){
    const docCharge = clients()

    return await db.collection("clients").add({
        BalanceCliente: 0,
        EsActivo: 1,
        FechaRegistro: new Date(),
        LimiteCredito: 0, 
        Persona: {
            ApellidoPersona: data.lastname,
            ApodoCliente: data.surname || "",
            CedulaPersona: data.rnc,
            CelularPersona: data.phoneC,
            CorreoElectronico: data.email,
            DireccionPersona: data.location,
            DireccionTrabajo: data.locationJob || "",
            EstadoCivil: data.status,
            FaxPersona: "",
            FechaNacimiento: data.datebirth,
            FotoPersona: "",
            IdCiudad: 0,
            IdSector: 0,
            LugarTrabajo: "",
            MontoRenta: 0,
            NombrePersona: data.name,
            ObservacionPersona: data.observation || "",
            Ocupacion: data.ocupation || "",
            Renta: 0,
            Sexo: data.gender,
            TelefonoOficina: data.phoneO || "",
            TelefonoResidencia: data.phoneR || "",
        },
        Salario: 0, 
        TipoCobro: 0,
        id: (await docCharge).id
    })
}

// save guarantors 
export async function saveGuarantors(data){
    const docCharge = clients()

    return await db.collection("guarantors").add({
        BalanceCliente: 0, 
        Persona: {
            ApellidoPersona: data.lastname,
            ApodoCliente: data.surname,
            CedulaPersona: data.rnc,
            CelularPersona: data.phoneC,
            CorreoElectronico: data.email,
            DireccionPersona: data.location,
            DireccionTrabajo: data.locationJob,
            EstadoCivil: data.status,
            FaxPersona: "",
            FechaNacimiento: data.datebirth,
            FotoPersona: "",
            IdCiudad: 0,
            IdSector: 0,
            LugarTrabajo: "",
            MontoRenta: 0,
            NombrePersona: data.name,
            ObservacionPersona: data.observation,
            Ocupacion: data.ocupation,
            Renta: 0,
            Sexo: data.gender,
            TelefonoOficina: data.phoneO,
            TelefonoResidencia: data.phoneR,
        },
        id: (await docCharge).id
    })
}
