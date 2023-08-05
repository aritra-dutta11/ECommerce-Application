import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, filterProductController, getProductController, getSingleProductController, productCountComtroller, productListController, productPhotoContorller, productWiseCategoryController, searchProductController, similarProductController, updateProductController } from "../controllers/productController.js"
import formidable from "express-formidable"

const router = express.Router()

//create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//get products
router.get('/get-product', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoContorller)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter products
router.post('/products-filter', filterProductController)

//product-count
router.get('/product-count', productCountComtroller)

//product per page
router.get('/product-per-page/:page', productListController)

//search product
router.get('/search-product/:keyword', searchProductController)

//similar products
router.get('/similar-product/:pid/:cid', similarProductController)

//category wise product
router.get('/product-category/:slug', productWiseCategoryController)

//payments routes
//token
router.get('/braintree-token', braintreeTokenController)

//payments
router.post('/braintree-payment', requireSignIn, braintreePaymentController)

export default router