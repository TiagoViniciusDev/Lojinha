import { MercadoPagoConfig, Preference } from 'mercadopago';
import ProductModel from "../models/productModel.js";

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

const preference = new Preference(client);


export const createPreference = async (req, res) => {
    try {

        const {shippingValue, productID, userID, productQuantity} = req.body

        if(!productID){
          return res.status(400).json({success: false, msg: "ID do produto não definido"})
        } 

        const Product = await ProductModel.findById(productID) //Puxando informações do produto

        if(!Product){
          return res.status(404).json({success: false, msg: "Produto não encontrado"})
        }

        if(!shippingValue){
          return res.status(400).json({success: false, msg: "Valor do frete não definido"})
        }

        if(!productQuantity){
          return res.status(400).json({success: false, msg: "Quantidade de itens não definida"})
        }

        const result = await preference.create({
            body: {
              payment_methods: {
                excluded_payment_methods: [], //Remover certos meios de pagamentos. Ex: remover pagamentos com catões visa
                excluded_payment_types: [], //Remover pagamentos. Ex: remover pagamentos por boleto
                installments: 5 //Número de parcelas
              },

              items: [
                {
                    title: Product.name,
                    picture_url: Product.imgs[0], //Img do produto
                    description: Product.desc, //Descrição do produto
                    category_id: Product.category, //Categoria do produto
                    currency_id: 'BRL', //Moeda, no caso real
                    quantity: productQuantity,
                    unit_price: Product.price
                }
              ],

              shipments:{
                    mode: 'custom', //Modo de envio
                    cost: shippingValue, //Valor do frete
                    mode: "not_specified",
                    local_pickup: false, //Remover pacote na agência
                    free_shipping: false, //Frete grátis
              },

              back_urls: { //Onde o usuário será mandado dependendo da condição do pagamento
                success: "https://www.99freelas.com.br/",
                failure: "https://www.99freelas.com.br/",
                pending: "https://www.99freelas.com.br/"
              },
              auto_return: "approved", //Redirecionamento automatico caso aprovado em 40s
              statement_descriptor: "MEU NEGOCIO", //Como irá aparecer no cartão do cliente a fatura
              metadata: {
                user_id: userID, // ID do usuário, capturado do token ou da sessão.
                product_ids: [productID], // IDs dos produtos. (Separe por virgula se mais de um, por exemplo: [123, 456, 789])
            },
            }
          })

          return res.status(200).json({success: true, result})
          
    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false, msg: "Falha ao criar preferencia"})
    }
}


export const notification = async (req, res) => {
  try {

    if (!req.body) {
      console.error('Body vazio recebido.');
      return res.status(400).json({ success: false, msg: "Body vazio." });
    }

    console.log('Notificação recebida:', req.body);

    // Extrair o ID do pagamento do corpo da requisição
    const paymentId = req.body.data.id;

    // Fazer uma chamada para a API do Mercado Pago para obter os detalhes do pagamento
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao consultar pagamento: ${response.statusText}`);
    }

    const paymentData = await response.json();

    // Verificar se o pagamento foi aprovado
    if (paymentData.status === 'approved') {
      console.log('Pagamento aprovado!');

      if (product) {
        console.log(`Produto atualizado com sucesso: ${product.name}`);
      } else {
        console.log('Nenhum produto encontrado com o ID de pagamento.');
      }
    } else {
      console.log(`Pagamento com status: ${paymentData.status}`);
    }

    return res.status(200).json({success: true, msg: "Notificação processada com sucesso"});
  } catch (error) {
    console.error('Erro ao processar notificação:', error.message);
    return res.status(400).json({success: false, msg: "Erro ao processar notificação"});
  }
};
