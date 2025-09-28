import express, { json } from "express";
import { authModels } from "./auth/models/auth.models.js";
import  jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
import routerAuth from "./auth/router/auth.router.js";

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use(routerAuth)

export {app};