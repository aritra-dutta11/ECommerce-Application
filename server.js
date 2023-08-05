//const express = require('express')
import express from 'express'
//const colors = require('colors')
import colors from 'colors'
//const dotenv = require('dotenv')
import dotenv from 'dotenv'
//const morgan = require('morgan')
import morgan from 'morgan'
//const connectDB = require('./config/db.js')
//const connectDB = require('./config/db')
import connectDB from "./config/db.js"

//const authRoutes = require('./routes/authRoute.js')
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoutes from "./routes/productRoute.js"
import cors from 'cors'

//Configure env
dotenv.config()

//database connect
connectDB()

const app = express()

//config morgan
//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

app.get('/', (req, res) => {
    res.send('<h1>Welcome to my Ecommerce</h1>')
})

//const port = process.env.port || 8080
//port = 8080
app.listen(8080, () => {
    console.log(`Server running on mode ${process.env.DEV_MODE} on 8080`.bgMagenta.black)
})
