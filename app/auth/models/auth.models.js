import { getMongoDB } from "../../db/mongo.js";
import bcrypt from "bcrypt"

let collectionName = process.env.AUTH_COLLECTION
export class authModels {
   
    static async createUser({username, password}){
        try{
            if(username){
                if(username.length < 3){
                return{ 
                    status: 400,
                    message: "Ha ocurrido un error en el AuthModel.CreateUser",
                    success: false
                }
            }
            }if(!password){
                return{
                   status: 400,
                   message: "Password is necesary",
                }
                
            }
            const hashedPassowrd = await bcrypt.hash(password, 10)
            const db = await getMongoDB()
            const collection = db.collection(collectionName)
            const existingUser = await collection.findOne({user: username})
            if(existingUser){
                return{
                    success: false,
                    status: 409,
                    message: "user already existing"
                }
            }
            const user = {
                user: username,
                password: hashedPassowrd
            }
            const result = await collection.insertOne(user)
            if(!result.acknowledged){
                return{
                    success: false,
                    status: 400,
                    message: "error with the module AuthModels.Create"
                }
            }else{
                return{
                    success: true,
                    status: 200,
                    message: "User creating correctly",
                    id: result.insertedId
                }
            }
        }catch(error){
            return{
                success: false,
                status: 500,
                message: "Internal server error",
                error: error.message
            }
        }
    }
    static async login({username, password}){
        try{
            if(username){
                if(username.length < 3){
                return{ 
                    status: 400,
                    message: "Ha ocurrido un error en el AuthModel.CreateUser",
                    success: false
                }
            }
            }if(!password){
                return{
                   status: 400,
                   message: "Password is necesary",
                   success: false
                }
                
            }
            const db = await getMongoDB()
            const collection = db.collection(collectionName)
            const user = await collection.findOne({user: username})
            if(!user){
                return{
                    success: false,
                    message: "username does not exist"
                }
            }
            const Isvalid = await bcrypt.compare(password, user.password) //passowrd que introduciste y user.password que esta en la db
            if(!Isvalid){
                return{
                    success: false,
                    message: "passowrd incorrect"
                }
            }else{
                return{
                    success: true,
                    message: "welcome again",
                    user: user
                }
            }
        }catch(error){
            
            return{
                status: 500,
                message: "Internal Server Error",
                success: false,
                error: error.message
                
            }
        }
    }
}

// (async ()=>{
//     let nombre = "Gabriel"
//     let passowrd = "1234"
//     const result = await authModels.createUser({username: nombre, password: passowrd})
//     console.log(result)
// })();
