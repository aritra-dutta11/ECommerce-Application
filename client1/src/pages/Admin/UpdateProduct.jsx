import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout/Layout'
import Dialog from './Dialog'
import { useNavigate, useParams } from 'react-router-dom'
import { Select } from 'antd'
const { Option } = Select

const UpdateProduct = () => {

    const [categories, setCategories] = useState([])
    const [photo, setPhoto] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")
    const [id, setId] = useState("")
    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
    })

    const navigate = useNavigate()
    const params = useParams()

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

    //handle update
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            //Property of browser, if we dont create a form... another alternative is that we create a form, put all the
            //input boxes there and then add a function to the onSubmit event of the form.
            const productData = new FormData()
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("quantity", quantity)
            productData.append("category", category._id)
            productData.append("shipping", shipping)
            photo && productData.append("photo", photo)

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData)
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
    //handle Dialog
    const handleDialog = (message, isLoading) => {
        setDialog({
            message,
            isLoading
        })
    }

    const sureDelete = () => {
        handleDialog("Are you sure you want to delete this product?", true);
    };


    //delete
    const handleDelete = async (choose) => {
        if (choose) {
            try {
                const res = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`)
                handleDialog("", false);
                toast.success(res.message)
                navigate('/dashboard/admin/products')
            } catch (error) {
                console.log(error)
                toast.error('Cannot delete product')

            }
        } else {
            handleDialog("", false)
        }

    }

    //single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setName(data.product.name)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setCategory(data.product.category)
            setShipping(data.product.shipping)
            setPhoto(data.product.photo)
            setId(data.product._id)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    useEffect(() => {
        getSingleProduct()

    }, [])


    return (
        <Layout title={'Dashboard - Update Product'}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false} placeholder='Select a Category' size='large' showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} value={category.name}>
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
                                {photo ? (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="product-photo" height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt="product-photo" height={'200px'} className='img img-responsive' />
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
                                <Select bordered={false} placeholder='Shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }} value={shipping ? 'Yes' : 'No'}>
                                    <Option value='0'>No</Option>
                                    <Option value='1'>Yes</Option>
                                </Select>
                                <div className="d-flex">
                                    <div className="mb-3 m-3">
                                        <button className='btn btn-primary' onClick={handleUpdate}>Update Product</button>
                                    </div>
                                    <div className="mb-3 m-3">
                                        <button className='btn btn-danger' onClick={sureDelete}>Delete Product</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {dialog.isLoading && (
                <Dialog
                    //Update
                    onDialog={handleDelete}
                    message={dialog.message}
                />
            )}
        </Layout>
    )
}

export default UpdateProduct