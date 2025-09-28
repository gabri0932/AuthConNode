import { MongoClient } from "mongodb";
import 'dotenv/config' // para usar las variables de entorno del .env

const url = process.env.MONGO_URL; // accedo a la variable de entorno del archivo .env
const database = process.env.DATABASE;

let client; // creo un nuevo cliente
let connectionIsOpen = false;

export async function getMongoDB(){
    if (!connectionIsOpen) {
        try {
            client = new MongoClient(url);
            await client.connect(); // me conecto a la base de datos
            connectionIsOpen = true;
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return client.db(database); // selecciono la base de datos y retorno la base de datos.
} //conectamos a la base de datos al iniciar la apa