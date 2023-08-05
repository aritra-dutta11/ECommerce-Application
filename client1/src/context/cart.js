import { useState, useContext, createContext, useEffect } from 'react'

const CartContext = createContext()


const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    useEffect(() => {
        let existingcartItem = localStorage.getItem('cart')
        if (existingcartItem) setCart(JSON.parse(existingcartItem))
    }, [])
    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    )
}

//custom
const useCart = () => useContext(CartContext)

export { useCart, CartProvider }