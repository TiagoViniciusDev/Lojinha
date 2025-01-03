import './Banner.css';
import api from '../../api/api';

import { useState, useEffect } from 'react';

import { LiaShippingFastSolid } from "react-icons/lia";
import { BiSolidOffer } from "react-icons/bi";
import { TbReplace } from "react-icons/tb";
import { FaRegCreditCard } from "react-icons/fa";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation} from 'swiper/modules';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Banner() {

    const { setLoading } = useContext(UserContext)
    const [categories, setCategories] = useState()

    async function getAllCategories(){
    setLoading(true)

    const response = await api('GET', `/productCategories`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setCategories(backendMsg.allCategories)
    } else{
        alert("Falha ao carregar categorias")
        setCategories()
    }
  }

  useEffect(() => {
    getAllCategories()
  },[])

  return (
    <div className='Banner'>
        <nav>
          {
            categories ? categories.map((item) => (
              <a key={item._id} href={`http://localhost:5173/buscar?categoria=${item.categoryName}`}>{item.categoryName}</a>
            )) : <p>Loading...</p>
          }
        </nav>

        <div className='banner'>
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
            modules={[Autoplay, Navigation]}
            className="mySwiper"
          >
              <SwiperSlide><div className='img' style={{backgroundImage: `url(banner1.webp)`}}></div></SwiperSlide>
              <SwiperSlide><div className='img' style={{backgroundImage: `url(banner1.webp)`}}></div></SwiperSlide>
              <SwiperSlide><div className='img' style={{backgroundImage: `url(banner1.webp)`}}></div></SwiperSlide>
          </Swiper>
        </div>

        <div className='info'>
          <div className='item'>
            <div className='icon'>
              <LiaShippingFastSolid />
            </div>
            <div className='text'>
              <p>Entrega em todo Brasil</p>
              <p>Garantimos o melhor envio de todo o Brasil</p>
            </div>
          </div>

          <div className='item'>
            <div className='icon'>
              <BiSolidOffer />
            </div>
            <div className='text'>
              <p>Melhores Preços</p>
              <p>Tenha o melhor preço do mercado em suas mãos</p>
            </div>
          </div>

          <div className='item'>
            <div className='icon'>
              <TbReplace />
            </div>
            <div className='text'>
              <p>Troca e devolução</p>
              <p>Confira nossa polica de trocas e devoluções</p>
            </div>
          </div>

          <div className='item'>
            <div className='icon'>
              <FaRegCreditCard />
            </div>
            <div className='text'>
              <p>Parcelamento</p>
              <p>Parcelamento em até 12 vezes</p>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Banner;