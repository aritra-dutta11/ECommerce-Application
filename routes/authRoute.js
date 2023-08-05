//const express = require('express')
import express from 'express'
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getUserOrdersController, getAllOrdersController, updateOrderIdController } from "../controllers/authController.js"
//const registerController = require("../controllers/authController.js")
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"


//router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register', registerController)

//LOGIN 
router.post('/login', loginController)

//test route
router.get('/test', requireSignIn, isAdmin, testController)

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

//Forgot Password
router.post('/forgot-password', forgotPasswordController)

//update profile
router.put('/update-profile', requireSignIn, updateProfileController)

//user orders
router.get('/user-orders', requireSignIn, getUserOrdersController)

//admin getting orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//admin update order status
router.put('/update-order/:orderID', requireSignIn, isAdmin, updateOrderIdController)

export default router