import express from 'express'
import { createPreference, notification } from '../controllers/MercadoPagoControllers.js'

const MercadoPagoRouter = express.Router()


MercadoPagoRouter.post("/create-preference", createPreference)
MercadoPagoRouter.post("/notification", notification)

export default MercadoPagoRouter