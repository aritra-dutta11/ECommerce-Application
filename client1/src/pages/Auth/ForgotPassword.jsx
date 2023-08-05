import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './Register.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [newPassword, setPass] = useState('')
    const [cpass, setCpass] = useState('')
    const [question, setQuestion] = useState('')
    const [isError, setError] = useState('')
    const [color, setColor] = useState('')

    const navigate = useNavigate()

    const checkValidation = (e) => {
        const cpass = e.target.value
        setCpass(cpass)
        if (newPassword !== cpass) {
            setError("Passwords did not match")
            setColor("text-danger fw-bolder")
        }
        else {
            setError("Passwords Match")
            setColor("text-success fw-bolder")
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword === cpass) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { question, email, newPassword })
                if (res && res.data.success) {
                    toast.success(res.data.message)
                    navigate("/login")
                } else {
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error('Something Wrong')
            }

        } else {
            alert("Passwords don't match")
        }
    }


    return (
        <Layout title="Forgot-Password">
            <div className="form-container">

                <form onSubmit={handleSubmit}>

                    <h1 className='title'>Change Password</h1>



                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder='Your Email address' required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="form-control" id="secans" placeholder='Security Answer' required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={newPassword} onChange={(e) => setPass(e.target.value)} className="form-control" id="password" placeholder='New Password' required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={cpass} onChange={(e) => checkValidation(e)} className="form-control" id="conpass" placeholder='Confirm New Password' required='true' />
                        <label htmlFor="" className={color}>{isError}</label>
                    </div>







                    {/* <div className='otp mb-3'>
                <input type="tel" className="form-control" value={OTP} onChange={(e) => setOTP(e.target.value)} pattern="['0-9]{6}" id="OTP" placeholder='Enter OTP' required='true' />
                <button className='btn btn-primary' onClick={onSignInSubmit}>Send OTP</button>
                <button className='btn btn-primary' onClick={validateOTP}>Verify OTP</button>
            </div> */}

                    <button type="submit" className="btn btn-primary">SUBMIT</button>
                </form>

            </div>
        </Layout>

    )
}

export default ForgotPassword