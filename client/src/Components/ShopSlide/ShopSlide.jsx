import './ShopSlide.css';
import ProductContainer from '../ProductContainer/ProductContainer';

import { useEffect, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation} from 'swiper/modules';

function ShopSlide({data}) {

  const [slideNumber, setSliderNumber] = useState(4)

  function sizeOfThings(){
      if(screen.width > 1024){
          setSliderNumber(4)
          return
      } else if(screen.width > 768){
          setSliderNumber(3)
          return
      } else if(screen.width > 512){
          setSliderNumber(2.5)
          return
      }  else if(screen.width <= 512){
          setSliderNumber(1.5)
          return
      }
    };
    
    window.addEventListener('resize', function(){
      sizeOfThings();
    });

     useEffect(() => {
      sizeOfThings()
     },[])

  return (
    <div className='ShopSlide'>
          <Swiper
            spaceBetween={20}
            slidesPerView={slideNumber}
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

            {data && data.length > 0 ? data.map((product) => (
              <SwiperSlide key={product._id}><ProductContainer key={product._id} productData={product}/></SwiperSlide>
            )) : <p>Não foi possivel carregar os produtos</p>}

          </Swiper>
    </div>
  );
}

export default ShopSlide;