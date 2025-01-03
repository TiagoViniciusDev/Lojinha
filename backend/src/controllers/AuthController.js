import { admin, bucket } from "../../firebaseAdmin.js";
import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const googleAuth = async (req, res) => {
    const { token, username, email, avatar } = req.body;  // Token enviado do frontend

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      if(uid){
        const User = await UserModel.findOne({email: email})

        //Se usuário já existir faça login
        if(User){
            const AccessToken = jwt.sign({id: User._id}, process.env.SECRET) //Gera um token com base no id do usuário e o Secret
            return res.cookie('access_token', AccessToken, { httpOnly: true }).status(200).json({success: true, user: User, msg: "Sucesso"});
        } else{
            //Se usuário não existir tem que registra-lo
            const numeroAleatorio = Math.floor(Math.random() * 1000000) + 1;
            const hashedPassword = bcrypt.hashSync(numeroAleatorio.toString(), 10) //Criptografando password

            const User = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                avatar: avatar
            })
        
            await User.save()

            const AccessToken = jwt.sign({id: User._id}, process.env.SECRET) //Gera um token com base no id do usuário e o Secret
            return res.cookie('access_token', AccessToken, { httpOnly: true }).status(200).json({success: true, user: User, msg: "Sucesso"});
        }
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      res.status(401).json({success: false, msg: "Token inválido"});
    }
}