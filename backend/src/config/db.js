import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        .then(() => {
            console.log("Conectado com sucesso ao mongoDB")
        })
    } catch (error) {
        console.log("Falha ao se conectar ao DB")
        console.log(error.message)
    }
}

export default connectDB