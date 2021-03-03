import firestore from '@react-native-firebase/firestore';

const db = firestore()

export async function getDataLoans(id){
    return await db.collection("loans").doc(`${id}`).get();
}

export async function getLoansClient(id){
    return await db.collection("loans").where("Cliente.IdCliente", "==", id).get();
}

export async function getLoansRoutes(uid){
    return await db.collection("routes").where("userId", "==", uid).get();
}

// get dues by loans 
export async function getDuesApi(id){
    return await db.collection("loans").where("id", "==", id).get()
}

// get charges 
export async function charges(){
    return await db.collection("charges").doc()
}

// get charges by loans id
export async function getChargesId(id){
    return await db.collection("charges").where("IdPrestamo", "==", id)
}

// get last charges 
export async function lastCharges(){
    return await db.collection('charges').orderBy('id', 'desc').limit(1).get();
}
 

// update dues

export async function updateDues(id, dues, balance){
    return await db.collection("loans").doc(`${id}`).update({
        'cuotas': dues,
        'BalancePrestamo': balance
    });
}


// save loans 
export async function saveLoans(client, guarantor, propertie, data){
    return await db.collection("loansPending").add({
        ClienteId: client.id || "",
        NombreCliente: client.name + " " + client.lastname,
        GaranteId: guarantor.id || "",
        NombreGarante: guarantor.name + " " + guarantor.lastname || "",
        FechaPrestamo: new Date(),
        MontoPrestamo: data.mount,
        ObjetosRenta: propertie || "",
        Plazo: data.place,
        Interes: data.interest,
        TipoPrestamo: data.status,
        TipoCobro: data.type
    })
}

// buscar prestamo pendiente 
export async function getPendingLoan(id){
    return await db.collection("loansPending").doc(id).get()
} 