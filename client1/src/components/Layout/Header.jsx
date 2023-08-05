import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AiFillShopping } from 'react-icons/ai'
import { FaShoppingCart } from 'react-icons/fa'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import SearchInput from '../Form/SearchInput'
import useCategory from '../../hooks/useCategory'
import { useCart } from '../../context/cart'
import { Badge } from 'antd'

const Header = () => {
    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const categories = useCategory()

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success("Logout Successful")
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to='/' className="navbar-brand"><AiFillShopping className='brandicon' /> Aritra's ECommerce</Link>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
                            <div className='m-3'>
                                <SearchInput />
                            </div>
                            <li className="nav-item">
                                <NavLink to='/' className="nav-link">Home</NavLink>
                            </li>


                            <li className="nav-item dropdown">
                                <Link to={'/categories'} className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-mdb-toggle="dropdown">
                                    Categories
                                </Link>
                                <ul className='dropdown-menu' aria-labelledby="dropdownMenuButton">
                                    <li><Link className='nav-link category' to={'/categories'}>All Categories</Link></li>
                                    {categories?.map((c) => (

                                        <>

                                            <li className='nav-link category'>
                                                <Link to={`/category/${c.slug}`} className='nav-link category'>{c.name}</Link>
                                            </li>

                                        </>

                                    ))}
                                </ul>

                            </li>

                            {
                                !auth.user ? (<>
                                    <li className="nav-item">
                                        <NavLink to='/register' className="nav-link">Register</NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to='/login' className="nav-link">Login</NavLink>
                                    </li>
                                </>) : (<>
                                    <li className="dropdown">
                                        <NavLink className="nav-link dropdown-toggle dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {auth?.user?.name}
                                        </NavLink>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="nav-link">Dashboard</NavLink></li>
                                            <li><NavLink onClick={handleLogout} to='/login' className="nav-link">Logout</NavLink></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to='/cart' className="nav-link"><FaShoppingCart /> ({cart?.length})</NavLink>
                                    </li>
                                </>)
                            }




                        </ul>

                    </div>
                </div >
            </nav >
        </>
    )
}

export default Header