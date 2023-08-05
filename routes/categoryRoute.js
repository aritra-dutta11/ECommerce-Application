import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { createCategoryController, deleteCategoryController, listCategoryController, singeCategoryController, updateCategoryConroller } from "../controllers/categoryController.js"
const router = express.Router()

//create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryConroller)

//list all categories
router.get('/list-categories', listCategoryController)

//get a single category
router.get('/single-category/:slug', singeCategoryController)

//Delete a category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default router