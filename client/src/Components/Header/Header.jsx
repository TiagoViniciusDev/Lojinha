import './Header.css';

import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Header() {

  const { user } = useContext(UserContext)

  const navigate = useNavigate()
 
  const [searchBar, setSearchBar] = useState()
  const [showMenuMobile, setShowMenuMobile] = useState(false)

  function search(e){
    e.preventDefault()
    if(searchBar){
        navigate(`/buscar?search=${searchBar}`)
    } else{
        navigate(`/buscar`)
    }
  }

  return (
    <header className='Header'>
            <div className='container'>
                <div>
                    <a href="/">
                        <h2>Lojinha</h2>
                    </a>
                    <form onSubmit={search}>
                        <input type="text" placeholder='Buscar' onChange={(e) => {setSearchBar(e.target.value)}}/>
                        <button type='submit'>
                            <FaSearch />
                        </button>
                    </form>
                    <FiMenu className='menuMobileBtn' style={showMenuMobile ? {display: "none"} : ""} onClick={() => {setShowMenuMobile(true)}}/>
                    <IoMdClose className='menuMobileBtn' style={showMenuMobile ? "" : {display: "none"}} onClick={() => {setShowMenuMobile(false)}}/>
                    <div className='part3'>
                        {user ? 
                            <div className='myAccount' onClick={() => {navigate("/usuário");}}>
                                <FaUserCircle />
                                <p>Minha conta</p>
                            </div>
                        : 
                            <div className='myAccount' onClick={() => {navigate("/entrar")}}>
                                <FaUserCircle />
                                <p>Entrar</p>
                            </div>
                        }
                        <div className='cart' onClick={() => {navigate("/usuário/carrinho")}}>
                            <FaShoppingCart />
                            <p>Carrinho</p>
                        </div>
                    </div>
                </div>
                <nav className='mobileNav' style={showMenuMobile ? {display: "flex"} : {display: "none"}}>
                    <div>
                        <form onSubmit={search}>
                            <input type="text" placeholder='Buscar' onChange={(e) => {setSearchBar(e.target.value)}}/>
                            <button type='submit'>
                                <FaSearch />
                            </button>
                        </form>
                    </div>
                    <div className='part3'>
                        {user ? 
                            <div className='myAccount' onClick={() => {navigate("/usuário"); setShowMenuMobile(false)}}>
                                <FaUserCircle />
                                <p>Minha conta</p>
                            </div>
                        : 
                            <div className='myAccount' onClick={() => {navigate("/entrar"); setShowMenuMobile(false)}}>
                                <FaUserCircle />
                                <p>Entrar</p>
                            </div>
                        }
                        <div className='cart' onClick={() => {navigate("/usuário/carrinho")}}>
                            <FaShoppingCart />
                            <p>Carrinho</p>
                        </div>
                    </div>
                </nav>
            </div>
    </header>
  );
}

export default Header;