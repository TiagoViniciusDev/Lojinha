import './Product.css';
import api from '../../api/api'

import { useState, useEffect } from 'react';

import { FaShoppingCart } from "react-icons/fa";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation, Pagination} from 'swiper/modules';

function Product() {

  const url = window.location.href;
  const urlParts = url.split('/');

  const {setLoading} = useContext(UserContext)

  const [productData, setProductData] = useState()
  const [mainImg, setMainImg] = useState()
  // const [shippingOptions, setShippingOptions] = useState([])
  // const [clientCEP, setClientCEP] = useState("")

  async function getProductData(){
    setLoading(true)

    const response = await api('GET', `/product/productByID/${urlParts[4]}`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setProductData(backendMsg.Product)
    } else{
        alert("Falha ao carregar informações do produto")
        setProductData()
    }
  }

  function changeMainImg(imgURL){
    setMainImg(imgURL)
  }

  useEffect(() => {
    getProductData()
  },[])

  async function checkout(){
    setLoading(true)
    try {

      const body = {
        productID: productData._id,
        shippingValue: 10,
        productQuantity: 1
      }
      
      const response = await api('POST', `/mercado-pago/create-preference`, body);
      const data = await response.json()

      if(data.success === false){
        return alert(data.msg)
      }

      console.log(data.result)
      console.log(data.result.init_point)
      
      window.location.href = data.result.init_point //Redirecionando para pagamento
  
  
    } catch (error) {
      console.log(error)
      alert("Falha ao direcionar usuário para pagina de pagamento, tente novamente mais tarde")
    }

    setLoading(false)
  }

  // async function calcularFrete() {
  //   console.log("Calculando...")

  //   setLoading(true)
  //   try {

  //     const cepSemHifen = clientCEP.replace("-", "");

  //     const body = {
  //       DestinationCEP: cepSemHifen,
  //     }

  //     const response = await fetch(`http://localhost:8000/shipping`, {
  //       method: 'POST',
  //       body: JSON.stringify(body),
  //       headers: {"Content-type": "application/json;charset=UTF-8"},
  //       credentials: 'include'
  //     })
  //     const data = await response.json()

  //     if(data.success === false){
  //       return alert(data.msg)
  //     }

  //     console.log(data.response)
  //     setShippingOptions(data.response)
      
  //     // const response = await fetch(url, options)
  //     // const result = await response.json()
  
  //   } catch (error) {
  //     console.log(error)
  //     alert("Falha ao direcionar usuário para pagina de pagamento, tente novamente mais tarde")
  //   }

  //   setLoading(false)
  // }

  // const handleInputChange = (e) => {
  //   let input = e.target.value;

  //   // Remove caracteres não numéricos
  //   input = input.replace(/\D/g, "");

  //   // Formata para o padrão de CEP (00000-000) apenas quando houver 6 ou mais dígitos
  //   if (input.length > 5) {
  //     input = input.slice(0, 8).replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
  //   }

  //   setClientCEP(input);
  // };
  

  return (
    <main className='Product'>
        <div className='container'>
          {productData ? 
            <div>
              <div className='div1'>
                <section className='productImgs'>
                  <div className='sideImgs'>
                    {productData.imgs.map((img) => (
                      <div className='img' key={img} style={{backgroundImage: `url(${img})`}} onClick={() => {changeMainImg(img)}}></div>
                    ))}
                  </div>
                  <div className='mainImg' style={mainImg ? {backgroundImage: `url(${mainImg})`} : {backgroundImage: `url(${productData.imgs[0]})`}}></div>
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    // navigation={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}    
                    scrollbar={{ draggable: true }}
                    pagination={true}
                    modules={[Pagination]}
                    className="mobileSlide"
                  >
                      {productData.imgs.map((img) => (
                        <SwiperSlide key={img}>
                          <div className='img' style={{backgroundImage: `url(${img})`}}></div>
                          {/* <img src={img} alt={img} /> */}
                        </SwiperSlide>
                       ))}
                  </Swiper>
                </section>
                <section className='productInfo'>
                  <p className='productName'>{productData.name}</p>
                  <p className='category'>Categoria: <span>{productData.category}</span></p>
                  <div className='priceInfo'>
                    <p>De <span>R$ {Math.ceil(productData.price + productData.price*0.2)},00</span></p>
                    <p>R$ {productData.price},00</p>
                    <p>Até 3x de R$ {Math.ceil((productData.price + productData.price*0.2)/3)},00</p>
                  </div>
                  <div className='buttons'>
                    <a onClick={checkout}>
                      Comprar
                    </a>
                    <a>
                      <FaShoppingCart />
                      Adicionar ao carrinho
                    </a>
                  </div>

                  {/* <div className='shipping'>
                    <p>Calcular Frete</p>
                    <form onSubmit={(e) => {e.preventDefault(); calcularFrete()}}>
                      <input type="text" placeholder='CEP' value={clientCEP} onChange={handleInputChange} required/>
                      <button>Calcular</button>
                    </form>
                  </div>

                  <div className='shippingOptions'>
                    {shippingOptions && shippingOptions.length > 0 ? (
                      shippingOptions
                        .filter((item) => !item.error) // Filtra os itens que não têm a propriedade 'error'
                        .map((item) => (
                          <div className='option' key={item.id}>
                            <img src={item.company.picture} alt={item.company.name} />
                            <p>R${item.price}</p>
                            <p>{item.delivery_range.min} a {item.delivery_range.max} dias úteis</p>
                          </div>
                        ))
                    ) : (
                      <p>Nenhuma opção disponível</p> // Adicione um fallback caso não haja opções
                    )}
                  </div> */}

                </section>
              </div>

              <section className='div2'>
                <div className='desc'>
                  <h2>Descrição</h2>
                  <p>{productData.desc}</p>
                </div>
              </section>
            </div>
           : <p></p>}
        </div>
    </main>
  );
}

export default Product;