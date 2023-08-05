//const mongoose = require('mongoose')
import mongoose from 'mongoose'
//const colors = require('colors')
import colors from 'colors'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connection established, host is ${conn.connection.host}`.bgMagenta.black)
    } catch (error) {
        console.log(`Error in connection ${error}`.bgRed.white)
    }
}
//export default connectDB
export default connectDB