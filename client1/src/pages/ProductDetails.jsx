import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const ProductDetails = () => {

    const params = useParams()
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        if (params?.slug) getProduct()
    }, [params?.slug])
    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProducts(data?.product._id, data?.product?.category._id)
        } catch (error) {
            console.log(error)
        }
    }

    //get similar products
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/similar-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} className="card-img-top" height="500" alt={product.name} />
                </div>
                <div className="col-md-6">
                    <h1 className='text-center '>Product Details</h1>
                    <h5 className='m-3'>Name: {product.name}</h5>
                    <h5 className='m-3'>Description: {product.description}</h5>
                    <h5 className='m-3'>Price: {product.price}</h5>
                    <h5 className='m-3'>Category: {product?.category?.name}</h5>
                    <button className='btn btn-primary m-3'>Add to Cart</button>

                </div>
            </div>
            <hr />
            <div className="row m-3">
                <h3>Similar Products for you</h3>
                {relatedProducts.length < 1 && (<p className='text-center fw-bold'>No Similar Products</p>)}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map(p => (

                        <div className="card m-2" style={{ width: '18rem' }} >
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0.30)}...</p>
                                <p className="card-text">Rs {p.price}</p>
                                <button className='btn btn-primary ms-2'>Add to Cart</button>
                                <button className='btn btn-secondary ms-3' onClick={() => navigate(`/product-details/${p.slug}`)}>View Details</button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails