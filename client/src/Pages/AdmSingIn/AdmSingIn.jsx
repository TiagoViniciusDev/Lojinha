import './AdmSingIn.css';
import api from '../../api/api'

import {useNavigate} from 'react-router-dom'
import { useState } from 'react';

import { MdAdminPanelSettings } from "react-icons/md";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function AdmSingIn() {

  const navigate = useNavigate()

  const { setUser, setLoading } = useContext(UserContext)  

  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()
  const [error, setError] = useState()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)

    if(!userEmail){
      alert('Email não definido')
      return
    }

    if(!userPassword){
      alert('Senha não definida')
      return
    }

    try {
      const requestBody = {
        email: userEmail,
        password: userPassword
      }
  
      const response = await api("POST", "/user/singin", requestBody)
      const backendMsg = await response.json()
      
      if(backendMsg.success === false){
        console.log(backendMsg)
        setError(backendMsg.msg)
        setLoading(false)
        return
      }

      if(backendMsg.success === true){

        if(backendMsg.user.role !== "admin"){ //Verificando se tem permissão de adm
          setLoading(false)
          alert("Você não tem permissão para acessar o painel do administrador")
          navigate("/")
          return
        }

        sessionStorage.setItem('user', JSON.stringify(backendMsg.user))
        setUser(backendMsg.user)
        navigate("/admin/access")
        setError(null)
      }

    } catch (error) {
      console.log(error)
      alert("Falha ao tentar fazer login")
      setError(true)
    }
    setLoading(false)
  }

  return (
    <main className='Sing AdmSingIn'>
      <div className='container'>
          <div className='text'>
            <div className='icon'>
              <MdAdminPanelSettings />
            </div>
            <p>Painel do administrador</p>
            <p>Informe seus dados abaixo para entrar</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="email" name='email' placeholder='Email' autoComplete='email' required onChange={(e) => {setUserEmail(e.target.value)}}/>
            <input type="password" name='password' placeholder='Senha' autoComplete="current-password" required onChange={(e) => {setUserPassword(e.target.value)}}/>
            <button type='submit'>Entrar</button>
          </form>
          <div className='anotherForm'>
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </div>
      </div>
    </main>
  );
}

export default AdmSingIn;