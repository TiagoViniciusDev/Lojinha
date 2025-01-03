import './UserLayout.css';
import UserSideBar from '../UserSideBar/UserSideBar';

import { useEffect } from 'react';

import { Outlet, useNavigate } from "react-router-dom"

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function UserLayout() {

  const { user } = useContext(UserContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      alert("Faça Login para poder usar o carrinho")
      navigate("/entrar");
    }
  }, [user]);

  // Exibe um conteúdo vazio temporário enquanto redireciona
  if (!user) {
    return null; // Impede renderização do código abaixo
  }

  return (
    <div className='UserLayout'>
        <div className='container'>
          <UserSideBar />
          <Outlet />
        </div>
    </div>
  );
}

export default UserLayout;