import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
const routerAuth = Router()
const SECRET_KEY = process.env.SECRET_KEY;
routerAuth.get("/",(req, res)=>{
    res.json({
            status:200,
            message: "Server is working correctly"
        })
})
routerAuth.post("/login", AuthController.LoginController)
routerAuth.post("/register", AuthController.RegisterController)
routerAuth.post("/logout", AuthController.logoutController)
routerAuth.get("/protected", AuthController.ProtectedRouter)

export default routerAuth