import './Dashboard.css';

import {useNavigate} from 'react-router-dom'

import { FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaBoxArchive } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";

function Dashboard() {

  const navigate = useNavigate()

  return (
    <main className='Dashboard'>
        <nav className='links'>
            <a className='dashboardItem' onClick={() => {navigate('/usuários')}}>
                <div className='icon'>
                    <FaUsers />
                </div>
                <p>Usuários</p>
            </a>

            <a className='dashboardItem' onClick={() => {navigate("categorias")}}>
                <div className='icon'>
                    <BiSolidCategory />
                </div>
                <p>Categorias</p>
            </a>

            <a className='dashboardItem' onClick={() => {navigate("produtos")}}>
                <div className='icon'>
                    <FaBoxArchive />
                </div>
                <p>Produtos</p>
            </a>

            <a className='dashboardItem' onClick={() => {navigate("pedidos")}}>
                <div className='icon'>
                    <FaClipboardList />
                </div>
                <p>Pedidos</p>
            </a>
        </nav>

        <section className='banner homeBanner'>
            <h3>Home Banner</h3>
            <button>+ Adicionar Imagem</button>
            <p>Recomendamos imagens com dimensões de 1312x380</p>
            <div className='homeBannerImgs'>
                {/* <img src="banner1.webp" alt="imagem do banner" /> */}
                <img src="../../../public/banner1.webp" alt="imagem do banner" />
                <img src="../../../public/banner1.webp" alt="imagem do banner" />
            </div>
        </section>

        <section className='banner homeBanner2'>
            <h3>Home Banner 2</h3>
            <button>+ Adicionar Imagem</button>
            <p>Recomendamos imagens com proporção 1:1 (1080x1080)</p>
            <div className='homeBanner2Imgs'>
                <img src="../../../public/bannerImg1.webp" alt="imagem do banner" />
                <img src="../../../public/bannerImg2.gif" alt="imagem do banner" />
                <img src="../../../public/bannerImg3.webp" alt="imagem do banner" />
            </div>
        </section>
    </main>
  );
}

export default Dashboard;