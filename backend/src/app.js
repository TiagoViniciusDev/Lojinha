import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import userRouter from './routers/User.routes.js'
import ProductRoutes from './routers/Product.routes.js'
import ProductCategoriesRouter from './routers/ProductCategories.routes.js'
import authRouter from './routers/Auth.routes.js'
import MercadoPagoRouter from './routers/MercadoPago.routes.js'

const app = express()

//Conecta ao banco de dados
connectDB()

app.use(express.json())
app.use(cookieParser())

// Middleware para resolver erro CORS

app.use(cors({
  origin: true, // Permitir qualquer origem
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Permitir credenciais
}));


app.get('/', (req, res) => {
    res.status(200).json("SERVIDOR OK")
})

app.use('/user', userRouter)
app.use('/product', ProductRoutes)
app.use('/productCategories', ProductCategoriesRouter)
app.use('/auth', authRouter)
app.use('/mercado-pago', MercadoPagoRouter)



export default app