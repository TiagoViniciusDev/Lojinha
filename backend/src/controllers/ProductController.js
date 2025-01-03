import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";

//AWS S3
import { S3Client, DeleteObjectCommand  } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Configuração do cliente AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const allProducts = async (req, res) => {
    try {
        const { categoria, search, amount } = req.query;

        const query = {};

        // Filtrar por categoria, se fornecida
        if (categoria) {
          query.category = categoria;
        }
      
        // Filtrar por busca de texto, se fornecida
        if (search) {
          query.name = { $regex: search, $options: 'i' }; 
        }
      
        // Aplicar limite de quantidade, se fornecido
        const limit = amount ? parseInt(amount, 10) : undefined;
      
        const Products = await ProductModel.find(query).limit(limit);
        res.status(200).json({ success: true, Products });

    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, msg: "Erro ao carregar produtos"})
    }
}

export const productByID = async (req, res) => {
    try {
        const productID = req.params.id
        
        if(!productID){
            return res.status(400).json({success: false, msg: "Informe o ID do produto"})
        }

        const Product = await ProductModel.findById(productID)
        
        if(!Product){
            return res.status(404).json({success: false, msg: "Produto não encontrado"})
        }

        res.status(200).json({success: true, Product})

    } catch (error) {
        res.status(400).json({success: false, msg: "Erro ao carregar produtos"})
    }
}

export const ProductsByID = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, msg: "Informe os produtos como um array de IDs" });
        }

        // Buscar todos os produtos cujos IDs estão no array
        const productsList = await ProductModel.find({ _id: { $in: products } });

        if (!productsList) {
            return res.status(404).json({ success: false, msg: "Produto não encontrado" });
        }

        if (productsList.length === 0) {
            return res.status(404).json({ success: false, msg: "Nenhum produto encontrado" });
        }

        res.status(200).json({ success: true, products: productsList });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        res.status(500).json({ success: false, msg: "Erro ao carregar produtos" });
    }
};


export const newProduct = async (req, res) => {
    try {
        const {userID, name, desc, category, price, imgs} = req.body

        //Verificando se usuário existe
        const user = await UserModel.findById(userID)
        if(!user){return res.status(404).json({success: false, msg: "usuário inválido"})}
        if(!name || !desc || !category || !price){return res.status(400).json({success: false, msg: "Informe todos os dados do produto (Nome, descrição ,categoria, preço e imagens)"})}
        if(!imgs){return res.status(400).json({success: false, msg: "Selecione as imagens do produto"})}

        //FAZER VERIFICAÇÂO SE CATEGORIA EXISTE

        const Product = new ProductModel({
            name, 
            desc,
            category, 
            price,
            imgs
        })

        await Product.save()

        res.status(200).json({success: true, msg: 'produto publicado com successo'})

    } catch (error) {
        res.status(400).json({success: false, msg: 'Falha ao publicar produto'})
    }
}

export const productImgs = async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, msg: "Nenhum arquivo enviado" });
    }
  
    try {
      // Fazer upload de cada arquivo e armazenar as URLs de resposta
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `Imagens Produtos/ProductImg - ${new Date().getTime()} - ${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: 'public-read',
          };
  
          const upload = new Upload({
            client: s3Client,
            params: uploadParams,
          });
  
          const data = await upload.done();
          return { filename: file.originalname, url: data.Location };
        })
      );
  
      return res.status(200).json({ success: true, msg: "Arquivos enviados com sucesso!", files: uploadResults });
    } catch (error) {
      console.error('Erro ao enviar os arquivos:', error);
      return res.status(500).json({ success: false, msg: "Erro ao enviar os arquivos", error: error.message });
    }
}


export const deleteProductByID = async (req, res) => {
    try {
        const { productID } = req.body

        if(!productID){
            return res.status(400).json({success: false, msg: "Informe o id do produto"})
        }

        const Product = await ProductModel.findById(productID)

        if(!Product){
            return res.status(404).json({success: false, msg: "Falha ao localizar produto"})
        }

        await Product.imgs.map(async (url) => { //Map deletando todas as imgs do produto

            const lastPart = url.split('/').pop();
            const decodedLastPart = decodeURIComponent(lastPart);

            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `Imagens Produtos/${decodedLastPart}`, // Caminho do arquivo no bucket
            };

            try {
                // Deletar o arquivo do S3
                const command = new DeleteObjectCommand(deleteParams);
                await s3Client.send(command);
    
            } catch (error) {
                console.error('Erro ao deletar o arquivo:', error);
                return res.status(500).json({ success: false, msg: 'Erro ao deletar o arquivo', error: error.message });
            }
        })

        await ProductModel.findByIdAndDelete(productID)

        res.status(200).json({success: true, msg: "Produto Deletado com sucesso"})

    } catch (error) {
        res.status(400).json({success: false, msg: "Falha ao deletar produto"})
    }
}