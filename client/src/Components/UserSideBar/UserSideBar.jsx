import './UserSideBar.css';

import { FaUser, FaUnlock, FaShippingFast, FaShoppingCart } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function UserSideBar() {

  const navigate = useNavigate()

  const { setUser } = useContext(UserContext)  

  const url = window.location.href; // Obtém a URL completa
  const parts = url.split('/usu%C3%A1rio/'); // Divide a URL no ponto "/usuario/"
  const result = parts[1]; // Pega a parte após "/usuario/"

  function logOut(){
    setUser()
    sessionStorage.removeItem('user')
    navigate("/")
  }

  return (
    <aside className='UserSideBar'>
        <a href="/usuário" className={result === undefined ? "selected" : ""}>
            <FaUser />
            <p>Perfil</p>
        </a>
        <a href="/usuário/alterar-senha" className={result === "alterar-senha" ? "selected" : ""}>
            <FaUnlock />
            <p>Alterar Senha</p>
        </a>
        <a href="/usuário/meus-pedidos" className={result === "meus-pedidos" ? "selected" : ""}>
            <FaShippingFast />
            <p>Meus Pedidos</p>
        </a>
        <a href="/usuário/carrinho" className={result === "carrinho" ? "selected" : ""}>
            <FaShoppingCart />
            <p>Carrinho</p>
        </a>
        <a onClick={logOut}>
            <CiLogout />
            <p>Desconectar</p>
        </a>
    </aside>
  );
}

export default UserSideBar;