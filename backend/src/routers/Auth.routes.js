import express from 'express'

import { googleAuth } from '../controllers/AuthController.js'

const authRouter = express.Router()

authRouter.post("/googleAuth", googleAuth)

export default authRouter