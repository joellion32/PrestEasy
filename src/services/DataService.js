import firestore from '@react-native-firebase/firestore';
import dateConfig from '../config/validation';

const db = firestore()


// get objects in rents 
export async function getRents(id){
    return await db.collection("rents")
    .where("Cliente.id", "==", id)
    .get()
}

// get charges 
export async function rents(){
    return await db.collection("rents").doc()
}

// create rent 
export async function createRent(type, data, user){
    let type2 = "";  
    
    if(type == 1){
        type2 = "Vehiculo" 
        return await db.collection("rents").add({Tipo: type2, Cliente: user, Vehiculo: data})
    }else{
        type2 = "Inmueble"
        return await db.collection("rents").add({Tipo: type2, Cliente: user, Inmueble: data})
    }
      
}

// cuadre del cobrador
export async function getCollector(){
    return await db.collection("charges").where("FechaCobro", "==", `${dateConfig.dateNow}`).get();
}

// save capital payment 
export async function saveCapital(data){
    return await db.collection("capital").add(data)
}


// get collector by dates 
export async function collectorDates(date, endDate){
    return await db.collection("charges").orderBy("FechaCobro").startAt(`${date}`).endAt(`${endDate}`).get()
}