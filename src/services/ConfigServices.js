import firestore from '@react-native-firebase/firestore';

const db = firestore()

// funcion que hace petion a firestore para obtener datos de configuracion 
const company = ["company_name", "company_logo", "company_phone", "company_address", "porciento_mora"]
const objectconfig = {}
export async function configData() {

    const promiseConfigurations = company.map((config)=> db.collection("configuration").where("name", "==", config).get())

    Promise.all(promiseConfigurations).then(arg => {
        arg.forEach((data) => {
            console.log(data.docs[0].data())
            objectconfig[data.docs[0].data().name] = data.docs[0].data().value;
        })
    })

   return objectconfig;
}