import './GoogleAuth.css';
import api from '../../api/api.js';
import { signInWithGoogle } from "../../firebase.js";

import { useNavigate } from 'react-router-dom';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function GoogleAuth({btnTitle}){

  const { setUser, setLoading } = useContext(UserContext)

  const navigate = useNavigate()

  async function handleGoogleLogin(){
    setLoading(true)
    try {
        const result = await signInWithGoogle();
        const user = result.user;

        if(user.emailVerified !== true){
            return alert("Erro, informe um email válido")
        }

        console.log(user)
  
        // Aqui você deve pegar o ID token do usuário
        const idToken = await user.getIdToken();

        const requestBody = {
            token: idToken,
            username: user.displayName,
            email: user.email,
            avatar: user.photoURL
        }

        const response = await api("POST", "/auth/googleAuth", requestBody)
        const backendMsg = await response.json()


        if(backendMsg.success == true){
            // console.log(backendMsg.user)
            sessionStorage.setItem('user', JSON.stringify(backendMsg.user))
            setUser(backendMsg.user)
            navigate("/")
        } else{
            alert(backendMsg.msg)
            console.log(backendMsg.msg)
        }

    } catch (error) {
        setLoading(false)
        console.error("Erro ao fazer login com Google:", error);
    }
    setLoading(false)
  }

  return (
    <div className='GoogleAuth'>
        <div className='googleBtn' onClick={handleGoogleLogin}>
            <img src="google.png" alt="google" />
            <p>{btnTitle}</p>
        </div>
    </div>
  );
}

export default GoogleAuth;