import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import "./Register.css"
import { AiFillEye } from "react-icons/ai"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import firebase from '../../firebase'

const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddr] = useState('')
    const [password, setPass] = useState('')
    const [cpass, setCpass] = useState('')
    const [question, setQuestion] = useState('')

    const [OTP, setOTP] = useState('')
    const [isError, setError] = useState('')
    const [color, setColor] = useState('')
    const navigate = useNavigate()


    // const configureCaptcha = () => {
    //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //         'size': 'invisible',
    //         'callback': (response) => {
    //             // reCAPTCHA solved, allow signInWithPhoneNumber.
    //             onSignInSubmit()
    //             console.log("Recaptcha verified")
    //         },
    //         defaultCountry: "IN"
    //     })
    // }

    // const onSignInSubmit = (e) => {
    //     e.preventDefault()
    //     configureCaptcha()

    //     const phoneNumber = "+91" + phone
    //     const appVerifier = window.recaptchaVerifier
    //     firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    //         .then((confirmationResult) => {
    //             // SMS sent. Prompt user to type the code from the message, then sign the
    //             // user in with confirmationResult.confirm(code).
    //             window.confirmationResult = confirmationResult
    //             // ...
    //         }).catch((error) => {
    //             // Error; SMS not sent
    //             // ...
    //         });
    // }

    // const validateOTP = (e) => {
    //     e.preventDefault()
    //     const code = OTP
    //     window.confirmationResult.confirm(code).then((result) => {
    //         // User signed in successfully.
    //         alert("Phone number verified")
    //         // ...
    //     }).catch((error) => {
    //         // User couldn't sign in (bad verification code?)
    //         // ...
    //     });
    // }

    const checkValidation = (e) => {
        const cpass = e.target.value
        setCpass(cpass)
        if (password !== cpass) {
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

        if (password === cpass) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, { name, email, phone, password, address, question })

                if (res && res.data.success) {
                    toast.success(res.data && res.data.message)
                    navigate("/login")
                }
                else {
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error('Something went wrong')
            }
        }
        else {
            alert("Passwords don't match")
        }
    }


    return (
        <Layout title="Registration Page">
            <div className="form-container">

                <form onSubmit={handleSubmit}>

                    <h1 className='title'>Register Yourself</h1>

                    <div className="mb-3">

                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" placeholder='Full Name Eg: Joe Hart' required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder='Your Email address' required='true' />
                    </div>

                    <div className="mb-3">
                        <div id='sign-in-button'></div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" placeholder='10 digit Phone Number(+91)' pattern="['0-9']{10}" required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="text" value={address} onChange={(e) => setAddr(e.target.value)} className="form-control" id="address" placeholder='Address' required='true' />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPass(e.target.value)} className="form-control" id="password" placeholder='Password' required='true' />

                    </div>

                    <div className="cpass mb-3">
                        <input type="password" value={cpass} onChange={(e) => checkValidation(e)} className="form-control" id="conpass" placeholder='Confirm Password' required='true' />
                        <label htmlFor="" className={color}>{isError}</label>
                    </div>

                    <div className="mb-3">
                        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="form-control" id="question" placeholder='Security Answer' required='true' />
                    </div>


                    {/* <div className='otp mb-3'>
                        <input type="tel" className="form-control" value={OTP} onChange={(e) => setOTP(e.target.value)} pattern="['0-9]{6}" id="OTP" placeholder='Enter OTP' required='true' />
                        <button className='btn btn-primary' onClick={onSignInSubmit}>Send OTP</button>
                        <button className='btn btn-primary' onClick={validateOTP}>Verify OTP</button>
                    </div> */}

                    <button type="submit" className="btn btn-primary">REGISTER</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register