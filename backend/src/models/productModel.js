import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: {type: String, required: true },
    price: {type: Number, required: true },
    imgs: { type: Array, required: true },
    feedback: {type: Array}
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema)

export default ProductModel

