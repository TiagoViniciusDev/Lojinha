import express from 'express'
import { allCategories, newCategory, deleteByID, editCategory } from '../controllers/ProductCategoriesController.js'

import { verifyToken } from '../utils/verifyUser.js'
import { verifyAdm } from '../utils/verifyAdm.js'

const ProductCategoriesRouter = express.Router()

ProductCategoriesRouter.get("/", allCategories)

ProductCategoriesRouter.post("/newCategory", verifyToken, verifyAdm, newCategory)
ProductCategoriesRouter.post("/editCategory", verifyToken, verifyAdm, editCategory)
ProductCategoriesRouter.delete("/deleteByID", verifyToken, verifyAdm, deleteByID)

export default ProductCategoriesRouter