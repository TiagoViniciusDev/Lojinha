import mongoose from "mongoose"

const ProductCategoriesSchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true }
}, { timestamps: true });

const ProductCategoriesModel = mongoose.model("ProductCategories", ProductCategoriesSchema)

export default ProductCategoriesModel