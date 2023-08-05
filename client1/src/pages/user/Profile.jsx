import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import UserMenu from '../../components/Layout/UserMenu'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddr] = useState('')
    const [password, setPassword] = useState('')
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const { name, email, phone, address } = auth?.user
        setName(name)
        setEmail(email)
        setAddr(address)
        setPhone(phone)
    }, [auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/update-profile`, { name, email, phone, address, password })
            console.log(data)
            if (data?.success) {
                console.log('Running')
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success('Profile Updated Successfully')
            }
            else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }

    }


    return (
        <Layout title={'Dashboard - My Profile'}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container">

                            <form onSubmit={handleSubmit}>

                                <h1 className='title'>User Profile</h1>

                                <div className="mb-3">

                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" placeholder='Full Name Eg: Joe Hart' required='true' />
                                </div>

                                <div className="mb-3">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder='Your Email address' required='true' readOnly />
                                </div>

                                <div className="mb-3">
                                    <div id='sign-in-button'></div>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" placeholder='10 digit Phone Number(+91)' pattern="['0-9']{10}" required='true' />
                                </div>

                                <div className="mb-3">
                                    <input type="text" value={address} onChange={(e) => setAddr(e.target.value)} className="form-control" id="address" placeholder='Address' required='true' />
                                </div>

                                <div className="mb-3">
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder='Password' />

                                </div>

                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile