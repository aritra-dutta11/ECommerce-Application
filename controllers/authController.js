import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/usermodel.js"
import jwt from "jsonwebtoken"
import orderModel from '../models/orderModel.js'


export const registerController = async (req, res) => {
    try {
        const { name, email, phone, password, address, question } = req.body

        //validation

        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone number is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!address) {
            return res.send({ message: 'Address is Required' })
        }


        const existingUser = await userModel.findOne({ email })

        //check for existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered please login',
            })
        }

        //register user

        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            question,
        }).save()
        res.status(201).send({
            success: true,
            message: 'Registration Successful',
            user,
        })

    } catch (message) {
        console.log(message)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            message,
        })
    }
}

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)

        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        //token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", })
        res.status(200).send({
            success: true,
            message: 'Login Successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })

    } catch (message) {
        console.log(message)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            message,
        })
    }
}

//test controller
export const testController = (req, res) => {
    res.send('Protected Route')
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { question, email, newPassword } = req.body

        if (!question) {
            return res.send({ message: 'Question is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!newPassword) {
            return res.send({ message: 'Password is required' })
        }

        const user = await userModel.findOne({ email, question })

        if (!user) {
            res.status(404).send({
                success: false,
                message: 'Wrong Email or password'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password reset Successful'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error,
        })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body
        const user = await userModel.findById(req.user._id)
        if (password) {
            return res.json({ error: 'Password is required' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            phone: phone || user.phone,
            password: hashedPassword || user.password,
            address: address || user.address,
        }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Profile Updated',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong in update',
            error,
        })
    }
}

export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Something went wrong while fetching products'
        })
    }
}

//all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: '-1' })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Something went wrong while fetching products'
        })
    }
}

//update order id controller

export const updateOrderIdController = async (req, res) => {
    try {
        const { orderID } = req.params
        const { status } = req.body
        const order = await orderModel.findByIdAndUpdate(orderID, { status }, { new: true })
        res.json(order)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Something went wrong in updating status'
        })
    }
}