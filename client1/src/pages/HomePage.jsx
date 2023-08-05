import React from 'react'
import Layout from '../components/Layout/Layout'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Button, Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'

const HomePage = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const [checked, setChecked] = useState([])
    const [price, setPrice] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const [cart, setCart] = useCart()

    const navigate = useNavigate()


    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-per-page/${page}`)
            setLoading(false)
            setProducts(data.products)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Cannot fetch products')
        }
    }

    useEffect(() => {
        if (!checked.length || !price.length) getAllProducts()
    }, [checked.length, price.length])

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

    //getTotal count
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`)
            setTotal(data?.totalProducts)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllCategories()
        getTotal()
    }, [])

    //handle Filter
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        } else {
            all = all.filter(c => c !== id)
        }
        setChecked(all)
    }

    //get filtered products based on price
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/products-filter`, { checked, price })
            setProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (checked.length || price.length) filterProduct()
    }, [checked, price])

    useEffect(() => {
        if (page === 1) return
        loadMore()
    }, [page])

    //load more
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-per-page/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <Layout title="Aritra's ECommerce Application">
            {/* <h1>HomePage</h1>
            <pre>{JSON.stringify(auth, null, 4)}</pre> */}

            <div className="row mt-3 m-2">
                <div className="col-md-2">

                    {/* FILTER BY CATEGORY */}

                    <h4 className='text-center'>Filter By Category</h4>
                    <div className="d-flex flex-column m-2">
                        {categories?.map((c) => (
                            <Checkbox key={c.id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    {/* FILTER BY PRICE */}

                    <h4 className='text-center mt-4'>Filter By Price</h4>
                    <div className="d-flex flex-column m-2">
                        <Radio.Group onChange={(e) => setPrice(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column m-3">
                        <button className='btn btn-danger' onClick={() => window.location.reload()}>RESET FILTERS</button>
                    </div>
                </div>
                <div className="col-md-10">
                    <h1 className='text-center'>All Products</h1>
                    <div className="d-flex flex-wrap">
                        {products?.map(p => (

                            <div className="card m-3 margin" style={{ width: '18rem' }} >
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0.30)}...</p>
                                    <p className="card-text">Rs {p.price}</p>
                                    <button className='btn btn-primary ms-2' onClick={() => { setCart([...cart, p]); localStorage.setItem('cart', JSON.stringify([...cart, p])); toast.success('Item added to cart') }}>Add to Cart</button>
                                    <button className='btn btn-secondary ms-3' onClick={() => navigate(`/product-details/${p.slug}`)}>View Details</button>
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products.length != 0 && products.length < total && (
                            <button className='btn btn-warning' onClick={(e) => {
                                e.preventDefault()
                                setPage(page + 1)
                            }}>{loading ? "Loading..." : "Load More"}</button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage