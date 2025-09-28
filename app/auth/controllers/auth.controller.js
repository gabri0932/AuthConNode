import { authModels } from "../models/auth.models.js"
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.SECRET_KEY;
export class AuthController{
    static async LoginController(req,res){
        const user = req.body.username
            const password = req.body.password
            console.log("peticion llegando")
            try{
                const login = await authModels.login({username: user, password: password})
                console.log(login)
                if(login.success){
                    const token = jwt.sign({
                        id: login.user._id,
                        user: login.user.user,
                        }, SECRET_KEY, 
                        {expiresIn: '1h'}
                    )
                    //creamos el token, sign para firmar, luego guardamos la info que queramos. segundo parametro el secret key
                    //tercer parametro la expiracion
                    res.cookie('access_token', token, {  //creamos la cookie, se le asigna un nombre, le paso el token y luego unas propiedades extras.
                        httpOnly: true, //la coookie solo se puede acceder en el servidor.
                        secure: false, //para que solo se pueda acceder mediante https.
                        sameSite: "strict" //poder acceder desde el mismo dominio o no.
        
                    })
                    res.status(200).json({
                        status: 200,
                        message: `Bienvenido/a ${user}`
                    })
                }else{
                    res.status(401).json({
                        status: 401,
                        message: "usuario no autorizado"
                    })
                }
                                   
                
            }catch(error){
                 res.status(401).json({
                    status:400,
                    error: error.message
                })
            }
    }
    static async logoutController(req, res){
        res.clearCookie('access_token')
        res.status(200).json({
        status:200,
        message: "logout successfully"
    })
    }
    static async RegisterController(req,res){
    console.log("peticion recibida:", req.body)
    const password = req.body.password
    const username = req.body.username
    try{
        if(username && password){
            const welcome = await authModels.createUser({username: username, password: password})
            if(welcome.success){
                res.status(200).json({
                    status: 200,
                    message: "User register correctly",
                    id: welcome.id
                })
            }else{
            res.status(400).json({
                stutus: 400,
                error: "el usuario ya existe o faltan datos"
            })
                }
    }
    }catch(error){
        res.status(400).json({
            status:400,
            error: error.message
        })
    }
    }
    static async ProtectedRouter(req, res){
        const token = req.cookies.access_token
        
        if(!token){
            res.status(403).json({
                Access: "Denegado"
            })
        }else{
            try {
            const data = jwt.verify(token, SECRET_KEY)
            console.log(data)
            res.status(200).json({
                status: 200,
                message: "Bienvenido a la pagina protegida.",
                user: {
                    id: data.id,
                    user: data.user
                    }
                })
        } catch (error) {
            res.status(401).json({
                status: 401,
                message: "Usuario no auntenticado"
            })
        }
        }
    }

}