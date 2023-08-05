import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import moment from 'moment'

const Orders = () => {
    const [auth, setAuth] = useAuth()
    const [orders, setOrders] = useState([])

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-orders`)
            setOrders(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (auth?.token) getOrders()
    }, [auth?.token])
    return (

        <Layout title={'Dashboard - My Orders'}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className='border shadow'>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <td scope='col'>#</td>
                                                    <td scope='col'>Status</td>
                                                    <td scope='col'>Buyer</td>
                                                    <td scope='col'>Date</td>
                                                    <td scope='col'>Payment</td>
                                                    <td scope='col'>Quantity</td>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>{i + 1}</th>
                                                    <th>{o?.status}</th>
                                                    <th>{o?.buyer?.name}</th>
                                                    <th>{moment(o?.createdAt).fromNow()}</th>
                                                    <th>{o?.payment?.success ? "Success" : "Failed"}</th>
                                                    <th>{o?.products?.length}</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="container">
                                            {o?.products?.map((p, i) => (
                                                <div className="row mb-2 card flex-row">
                                                    <div className="col-md-4 p-3">
                                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100x" height={"200px"} />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <h3 className='m-3'>{p.name}</h3>
                                                        <p className='m-3'>{p.description.substring(0, 30)}</p>
                                                        <h4 className='m-3'>Price : Rs {p.price}</h4>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default Orders