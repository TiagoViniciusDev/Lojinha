import ProductCategoriesModel from "../models/productCategoriesModel.js"

export const allCategories = async (req, res) => {
    try {
        const allCategories = await ProductCategoriesModel.find()
        return res.status(200).json({success: true, allCategories})
    } catch (error) {
        return res.status(404).json({success: false, msg: "Falha ao carregar categorias"})
    }
}

export const newCategory = async (req, res) => {
    try {
        const { categoryName } = req.body

        if(!categoryName){
            return res.status(400).json({success: false, msg: "Informe o nome da categoria"})
        }

        const ProductCategory = new ProductCategoriesModel({
            categoryName
        })

        await ProductCategory.save()

        res.status(201).json({success: true, msg: 'categoria criada com sucesso'})

    } catch (error) {
        return res.status(400).json({success: false, msg: "Falha ao criar categoria"})
    }
}

export const editCategory = async (req, res) => {
    try {
        const {categoryID, categoryName} = req.body

        if(!categoryID){
            return res.status(404).json({success: false, msg: "Informe o id da categoria"})
        }
        const Category = await ProductCategoriesModel.findById(categoryID)

        if(!Category){
            return res.status(404).json({success: false, msg: "Falha ao localizar categoria"})
        }

        await Category.updateOne({
            categoryName
        }) 

        return res.status(200).json({success: true, msg: "Categoria atualizada com sucesso"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false, msg: "Falha ao editar categoria"})
    }
}

export const deleteByID = async (req, res) => {
    try {
        const {categoryID} = req.body
        if(!categoryID){
            return res.status(200).json({success: false, msg: "Informe o id da categoria"})
        }
        const Category = await ProductCategoriesModel.findByIdAndDelete(categoryID)
        
        if(Category){
            return res.status(200).json({success: true, msg: "Categoria deletada com sucesso"})
        } else{
            return res.status(404).json({success: false, msg: "Categoria não encontrada"})
        }
    } catch (error) {
        return res.status(200).json({success: false, msg: "Falha ao deletar categoria"})
    }
}

