import express from 'express'
import { newProduct, allProducts, deleteProductByID, productByID, ProductsByID, productImgs } from '../controllers/ProductController.js'
// import { verifyToken } from '../utils/verifyUser.js'
import { verifyAdm } from '../utils/verifyAdm.js'

const ProductRoutes = express.Router()

//Multer
import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      // Verifica o tipo do arquivo com base no mimetype
      if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Aceita o arquivo
      } else {
        cb(new Error('Somente arquivos de imagem são permitidos!'), false); // Rejeita o arquivo
      }
    }
  });

ProductRoutes.get("/allProducts", allProducts)
ProductRoutes.get("/productByID/:id", productByID)
ProductRoutes.post('/uploadImgs', upload.array('file', 10), productImgs);
ProductRoutes.post("/products", ProductsByID)

//Precisa ser adm
ProductRoutes.delete("/deleteProduct", verifyAdm, deleteProductByID)
ProductRoutes.post("/newProduct", verifyAdm, newProduct)

export default ProductRoutes