import express from 'express'
import { singup, allUsers, singin, userByID, userNameByID, updateUser, deleteByID } from '../controllers/UserController.js'

import { verifyAdm } from '../utils/verifyAdm.js'
import { verifyToken } from '../utils/verifyUser.js'

const userRouter = express.Router()

userRouter.post("/allUsers", verifyAdm, allUsers)
userRouter.delete("/delete", verifyToken, verifyAdm, deleteByID)

userRouter.post("/userById/:id", verifyToken, userByID)
userRouter.put("/update", verifyToken, updateUser)

userRouter.get("/nameById/:id", userNameByID)
userRouter.post("/singin", singin)
userRouter.post("/singup", singup)

export default userRouter