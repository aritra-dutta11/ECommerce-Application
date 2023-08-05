import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react"
import axios from 'axios'
import toast from 'react-hot-toast'
const PageCart = () => {
    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const [clientToken, setClientToken] = useState("")
    const [instance, setInstance] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handlePayment = async () => {
        try {
            setLoading(true)
            const { nonce } = await instance.requestPaymentMethod()
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree-payment`, { cart, nonce })
            setLoading(false)
            localStorage.removeItem('cart')
            setCart([])
            navigate('/dashboard/user/orders')

        } catch (error) {
            console.log(error)
        }
    }

    //total price
    const totalPrice = () => {
        try {
            let total = 0
            cart?.map(p => { total = total + p.price })
            return total.toLocaleString('en-IN', {
                style: "currency",
                currency: "INR",
            })
        } catch (error) {
            console.log(error)
        }
    }

    //delete from cart
    const removeItem = (id) => {
        try {
            let mycart = [...cart]
            let myindex = mycart.findIndex(item => item._id === id)
            mycart.splice(myindex, 1)
            setCart(mycart)
            localStorage.setItem('cart', JSON.stringify(mycart))
            toast.success('Payment Successful')
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree-token`)
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getToken()
    }, [auth?.token])
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2 mb-1'>{`Hello ${auth?.token && auth?.user.name}`}</h1>
                        <h4 className='text-center'>{cart?.length ? `You have ${cart?.length} Products ${auth?.token ? "" : "Please Login to Checkout"}` : 'Your cart is empty'}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        {cart?.map(p => (
                            <div className="row mb-2 card flex-row">
                                <div className="col-md-4 p-3">
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100x" height={"200px"} />
                                </div>
                                <div className="col-md-8">
                                    <h3 className='m-3'>{p.name}</h3>
                                    <p className='m-3'>{p.description.substring(0, 30)}</p>
                                    <h4 className='m-3'>Price : Rs {p.price}</h4>
                                    <button className='btn btn-danger m-3' onClick={() => removeItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4 text-center">
                        <h2 >Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className="mb-3"></div>
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                            </>

                        ) : (
                            <div className="mb-3">
                                {auth?.token ? (
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                ) : (
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/login')}>Please Login to checkOut</button>
                                )
                                }
                            </div>
                        )}
                        <div className="mt-2">
                            {
                                !clientToken || !cart?.length ? ("") :
                                    (
                                        <>
                                            <DropIn
                                                options={{
                                                    authorization: clientToken,
                                                    paypal: {
                                                        flow: 'vault'
                                                    }
                                                }}
                                                onInstance={instance => setInstance(instance)}
                                            />


                                            <button className='btn btn-primary mb-3' onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}>{loading ? 'Processing...' : 'Make Payment'}</button>
                                        </>
                                    )

                            }

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PageCart