import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { AiFillEye } from "react-icons/ai"
import './Register.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { NavLink } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const location = useLocation()


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password })

            if (res && (await res).data.success) {
                toast.success(res.data && res.data.message)

                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || "/")
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something Went Wrong")
        }

    }

    return (
        <Layout title="Login Page">
            <div className="form-container">

                <form onSubmit={handleSubmit}>

                    <h1 className='title'>Login Form</h1>



                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder='Your Email address' required='true' />
                    </div>



                    <div className="">
                        <input type="password" value={password} onChange={(e) => setPass(e.target.value)} className="form-control" id="password" placeholder='Password' required='true' />

                    </div>

                    <div className="mb-3">
                        <NavLink to='/forgot-password' className="forgotp">Forgot Password?</NavLink>

                    </div>



                    {/* <div className='otp mb-3'>
                <input type="tel" className="form-control" value={OTP} onChange={(e) => setOTP(e.target.value)} pattern="['0-9]{6}" id="OTP" placeholder='Enter OTP' required='true' />
                <button className='btn btn-primary' onClick={onSignInSubmit}>Send OTP</button>
                <button className='btn btn-primary' onClick={validateOTP}>Verify OTP</button>
            </div> */}

                    <button type="submit" className="btn btn-primary">LOGIN</button>
                </form>

            </div>
        </Layout>

    )
}

export default Login