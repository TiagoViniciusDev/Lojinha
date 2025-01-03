import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const allUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        return res.status(200).json({success: true, users})
    } catch (error) {
        return res.status(404).json({success: false, msg: "Falha ao carregar usuários"})
    }
}

export const userByID = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        return res.status(200).json({success: true, user})
    } catch (error) {
        return res.status(404).json({success: false, msg: "Falha ao obter dados do id"})
    }
 }

 export const userNameByID = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        const username = user.username
        return res.status(200).json({success: true, username})
    } catch (error) {
        return res.status(404).json({success: false, msg: "Falha ao obter dados do id"})
    }
 }

 export const singup = async (req, res) => {
    try {
        const {username, email, password, cpf, phoneNumber, gender, birthDate, cep, address, complement, addressNumber, UF, city, neighborhood} = req.body

        const hashedPassword = bcrypt.hashSync(password, 10) //Criptografando password
    
        const User = new UserModel({
            username: username,
            email: email,
            password: hashedPassword,

            cpf: cpf,
            phoneNumber: phoneNumber,
            gender: gender,
            birthDate: birthDate,
        
            cep: cep,
            address: address,
            complement: complement,
            addressNumber: addressNumber,
            UF: UF,
            city: city,
            neighborhood: neighborhood 
        })
    
        await User.save()
        
        res.status(201).json({success: true, msg: "Usuário registrado com sucesso"})
    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, msg: "Falha ao criar usuário"})
    }
 }

 export const singin = async (req, res, next) => {
    const {email, password} = req.body

    try {
        //Verificando se email existe no banco
        const validUser = await UserModel.findOne({email: email})
        if(!validUser){return res.status(404).json({success: false, msg: "Usuário não encontrado"})}

        const validPassword = bcrypt.compareSync(password, validUser.password) //Verificando se a senha esta correta
        if(!validPassword){return res.status(404).json({success: false, msg: "Falha na autenticação, verifique se o email e senha estão corretos"})}

        const token = jwt.sign({id: validUser._id}, process.env.SECRET) //Gera um token com base no id do usuário e o Secret

        const {password: pass, ...rest} = validUser._doc
        const response = {password: password, ...rest}


        res.cookie('access_token', token, { httpOnly: true }).status(200).json({success: true, user: response});
    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, msg: "Falha ao fazer login"})
    }
}

export const updateUser = async (req, res,  next) => {
    try {
        const {userID, username, password, email, cpf, phoneNumber, gender, birthDate, cep, address, complement, addressNumber, UF, city, neighborhood, cart} = req.body
        const user = await UserModel.findById(userID)

        if(!user){
            return res.status(404).json({success: false, msg:"Usuário não encontrado"})
        }

        const updateItems = {
            username,
            password,
            email,
            cpf,
            phoneNumber,
            gender,
            birthDate,
            cep,
            address,
            complement,
            addressNumber,
            UF,
            city,
            neighborhood,
            cart
        }

        if(password){
            const hashedPassword = await bcrypt.hashSync(password, 10) //Criptografando password
            updateItems.password = hashedPassword
        }

        await user.updateOne(updateItems)

        const updatedUser = await UserModel.findById(userID)

        return res.status(200).json({success: true, msg: "Dados atualizados com sucesso", updatedUser})
    } catch (error) {
        console.log(error)
        return res.status(404).json({success: false, msg: "Falha ao carregar usuário"})
    }
}

export const deleteByID = async (req, res) => {

    try {
        const {deleteID} = req.body

        if(!deleteID){
            return res.status(404).json({success: false, msg: "Informe o id do usuário a ser deletado"})
        } 

        const user = await UserModel.findById(deleteID)
        
        if(!user){
            return res.status(404).json({success: false, msg: "Usuário não encontrado"})
        }

        await UserModel.findByIdAndDelete(deleteID)

        return res.status(200).json({success: true, msg: "Usuário deletado com sucesso"})
    } catch (error) {
        console.log(error)
        return res.status(404).json({success: false, msg: "Falha ao deletar usuário"})
    }
 }
