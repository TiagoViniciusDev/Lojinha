import './SingIn.css';
import GoogleAuth from '../../Components/GoogleAuth/GoogleAuth';
import api from '../../api/api'

import {Link, useNavigate} from 'react-router-dom'
import { useState, } from 'react';

import { HiOutlineLogin } from "react-icons/hi";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function SingIn() {

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
        sessionStorage.setItem('user', JSON.stringify(backendMsg.user))
        setUser(backendMsg.user)
        navigate("/")
        setError(null)
      }

    } catch (error) {
      console.log(error)
      alert("Falha ao tentar fazer login 1")
      setError(true)
    }
    setLoading(false)
  }

  return (
    <main className='Sing'>
      <div className='container'>
          <div className='text'>
            <div className='icon'>
              {/* <img src="./icon-login.png" alt="" /> */}
              <HiOutlineLogin style={{rotate: "180deg"}}/>
            </div>
            <p>Já tem uma conta?</p>
            <p>Informe seus dados abaixo para acessá-la</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="email" name='email' placeholder='Email' autoComplete='email' required onChange={(e) => {setUserEmail(e.target.value)}}/>
            <input type="password" name='password' placeholder='Senha' autoComplete="current-password" required onChange={(e) => {setUserPassword(e.target.value)}}/>
            <button type='submit'>Entrar</button>
            <GoogleAuth btnTitle="Entrar com o Google"/>
          </form>
          <section className='anotherForm'>
            <p>Não tem uma conta? <Link to="/registre-se">Registre-se</Link></p>
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </section>
      </div>
    </main>
  );
}

export default SingIn;