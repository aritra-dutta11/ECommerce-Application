import React from 'react'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CategoryProduct = () => {
    const params = useParams()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        if (params?.slug) getProductByCategory()
    }, [params?.slug])

    const getProductByCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            setProducts(data.products)
            setCategory(data.category)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Layout>
            <div className="container mt-3">
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>{products?.length} result(s) found</h6>
                <div className="d-flex flex-wrap">
                    {products?.map(p => (
                        <div className="card m-3 margin" style={{ width: '18rem' }} >
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

export default CategoryProduct