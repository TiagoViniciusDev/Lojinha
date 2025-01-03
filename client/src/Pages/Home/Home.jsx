import './Home.css';
import Banner from '../../Components/Banner/Banner';
import ShopSlide from '../../Components/ShopSlide/ShopSlide';
import Banner2 from '../../Components/Banner2/Banner2';
import api from '../../api/api.js'

import { useState, useEffect } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Home() {

  const { setLoading } = useContext(UserContext)

  const [products1, setProducts1] = useState([])
  const [products2, setProducts2] = useState([])
  // const [products3, setProducts3] = useState([])

  async function getProductsByCategory(categoria){
    setLoading(true)

    const response = await api('GET', `/product/allProducts?categoria=${categoria}&amount=10`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        return backendMsg.Products
    } else{
        alert("Falha ao carregar produtos")
        return []
    }
  }

  async function getData(){
    setProducts1(await getProductsByCategory('Eletrônicos'))
    setProducts2(await getProductsByCategory('Calçados'))
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <main className='Home'>
        <div className='container'>
            <Banner />

            <section className='category'>
                <div className='categoryTitle'>
                    <h2>Eletrônicos</h2>
                    <p>Ver mais</p>
                </div>
                <ShopSlide data={products1}/>
            </section>

            <section className='category'>
                <div className='categoryTitle'>
                    <h2>Calçados</h2>
                    <p>Ver mais</p>
                </div>
                <ShopSlide data={products2}/>
            </section>

            <Banner2 />
        </div>
    </main>
  );
}

export default Home;