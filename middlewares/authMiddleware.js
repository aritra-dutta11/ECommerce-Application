import jwt from 'jsonwebtoken'
import userModel from '../models/usermodel.js'

//Protected Routes Token Based
export const requireSignIn = async (req, res, next) => {
    // const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

    try {
        const decode = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        )
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
    }
}

//admin access

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)


        if (user.role === 0) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access",
            })
        }
        else {
            next()
        }

    } catch (error) {
        res.status(404).send({
            success: false,
            error,
            message: "Error in admin middleware",
        })

    }
}