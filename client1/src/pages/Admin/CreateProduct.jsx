import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
const { Option } = Select


const CreateProduct = () => {
    const [categories, setCategories] = useState([])
    const [photo, setPhoto] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")

    const navigate = useNavigate()

    //get all categories
    const getAllCategories = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/list-categories`)
            if (data?.success) {
                setCategories(data?.category)
            }

        } catch (error) {
            console.log(error)
            toast.error('Something went wrong in getting categories')
        }
    }

    //handle create
    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            //Property of browser, if we dont create a form... another alternative is that we create a form, put all the
            //input boxes there and then add a function to the onSubmit event of the form.
            const productData = new FormData()
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("quantity", quantity)
            productData.append("category", category)
            productData.append("shipping", shipping)
            productData.append("photo", photo)

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, productData)
            if (data?.success) {
                toast.success(data.message)
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <Layout title={'Dashboard - Create Product'}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false} placeholder='Select a Category' size='large' showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }}>
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type="file" name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>

                            </div>
                            <div className="mb-3">
                                {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="product-photo" height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input type="text" value={name} placeholder='Product Name' className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <textarea name="" id="" cols="96" rows="3" className='form-control' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>

                            <div className="mb-3">
                                <input type="number" value={price} placeholder='Product Price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                            </div>


                            <div className="mb-3">
                                <input type="number" value={quantity} placeholder='Product Quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <Select bordered={false} placeholder='Shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }}>
                                    <Option value='0'>No</Option>
                                    <Option value='1'>Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className='btn btn-primary' onClick={handleCreate}>Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct