import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

//Create Category
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: 'Name is required' })
        }

        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'Category exists',
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        return res.status(201).send({
            success: true,
            message: 'New Category Created',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }

}

//update category
export const updateCategoryConroller = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(201).send({
            success: true,
            message: 'Category updated',
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category Updation',
        })
    }
}

//list all categories
export const listCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            category,
            message: 'All categories listed',
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error is listing categories',
        })
    }
}

//get a single category on basis of slug

export const singeCategoryController = async (req, res) => {
    try {
        const { slug } = req.params
        const category = await categoryModel.findOne({ slug })
        res.status(201).send({
            success: true,
            category,
            message: 'Category Fetched',
        })

    } catch (error) {
        console.log(error)
        res.status.send({
            success: false,
            error,
            message: 'Error in listing the category'
        })
    }
}

//delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Category Deleted',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in deleting category'
        })
    }
}