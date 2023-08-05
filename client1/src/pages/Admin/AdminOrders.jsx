import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'
const { Option } = Select

const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Deliverd", "Cancel"])
    const [changeStatus, setChangeStatus] = useState("")
    const [auth, setAuth] = useAuth()
    const [orders, setOrders] = useState([])

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`)
            setOrders(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (auth?.token) getOrders()
    }, [auth?.token])

    const handleChange = async (value, orderID) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/update-order/${orderID}`, { status: value })
            getOrders()
        } catch (error) {
            console.log(error)

        }
    }
    return (
        <Layout title={'All Orders Admin'}>
            <div className="container m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className='border shadow mb-3'>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th scope='col'>#</th>
                                                    <th scope='col'>Status</th>
                                                    <th scope='col'>Buyer</th>
                                                    <th scope='col'>Date</th>
                                                    <th scope='col'>Payment</th>
                                                    <th scope='col'>Quantity</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <Select bordered={false} onChange={(value) => handleChange(value, o._id)} defaultValue={o?.status}>
                                                            {status.map((s, i) => (
                                                                <Option key={i} value={s}>{s}</Option>
                                                            ))}
                                                        </Select>
                                                    </td>
                                                    <td>{o?.buyer?.name}</td>
                                                    <td>{moment(o?.createdAt).fromNow()}</td>
                                                    <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                                    <td>{o?.products?.length}</td>
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

export default AdminOrders
