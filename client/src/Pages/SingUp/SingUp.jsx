import './SingUp.css';
import api from '../../api/api'
import GoogleAuth from '../../Components/GoogleAuth/GoogleAuth';

import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react';

import { FaUserPlus } from "react-icons/fa";
import { HiMiniIdentification } from "react-icons/hi2";
import { HiHomeModern } from "react-icons/hi2";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function SingUp() {

  const navigate = useNavigate()

  const {setLoading} = useContext(UserContext)

  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userConfirmPassword, setUserConfirmPassword] = useState("")

  const [userName, setUserName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState("")

  const [cep, setCep] = useState("")
  const [address, setAddress] = useState("")
  const [complement, setComplement] = useState("")
  const [addressNumber, setAddressNumber] = useState()
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [neighborhood, setNeighborhood] = useState("")

  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)

    if(!userName){
      alert('Nome não definido')
      return
    }

    if(!userEmail){
      alert('Email não definido')
      return
    }

    if(!userPassword){
      alert('Senha não definida')
      return
    }

    if(userPassword !== userConfirmPassword){
      alert('As senhas não correspondem')
      return
    }

    try {
      const requestBody = {
        username: userName,
        email: userEmail,
        password: userPassword,

        cpf: cpf,
        phoneNumber: phoneNumber,
        gender: gender,
        birthDate: birthDate,
    
        cep: cep,
        address: address,
        complement: complement,
        addressNumber: addressNumber,
        UF: state,
        city: city,
        neighborhood: neighborhood
      }

      console.log(requestBody)
  
      const response = await api("POST", "/user/singup", requestBody)
      const backendMsg = await response.json()
      
      if(backendMsg.success === false){
        setError(backendMsg.msg)
        setLoading(false)
        console.log(backendMsg)
        alert(backendMsg.msg)
        return
      }
  
      setError(null)
      alert("Usuário criado com sucesso")
      navigate("/entrar")
    } catch (error) {
      console.log(error)
      alert("Erro ao fazer registro")
      setError(true)
    }

    setLoading(false)
  }

  //Formatação CPF
  const cpfHandleChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    const result = numericValue
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .substring(0, 14); // Limita ao tamanho do CPF

    setCpf(result);
  };

  //Formatação celular
  const phoneHandleChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
  
    // Aplica a máscara
    const result = numericValue
      .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona o DDD
      .replace(/(\d{5})(\d)/, "$1-$2")   // Adiciona o hífen após o quinto número
      .substring(0, 15);                 // Limita ao tamanho do celular
  
    setPhoneNumber(result);
  };

  //Formatação Data de nascimento
  const birthDateHandleChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
  
    // Aplica a máscara
    let formattedDate = numericValue
      .replace(/^(\d{2})(\d)/, "$1/$2")   // Adiciona a barra após o dia
      .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3") // Adiciona a barra após o mês
      .substring(0, 10);                 // Limita ao tamanho da data (10 caracteres)
  
    // Validação de datas
    const [day, month, year] = formattedDate.split("/").map(Number);
  
    if (month > 12) {
      formattedDate = formattedDate.replace(/\/\d{2}$/, "/");
    } else if (day > 31) {
      formattedDate = formattedDate.replace(/^\d{2}/, "31");
    } else if (year && year < 1900) {
      formattedDate = formattedDate.replace(/\d{4}$/, "1900");
    }
  
    if (day > 0 && month > 0 && year > 0) {
      const isValidDate = new Date(year, month - 1, day).getDate() === day;
      if (!isValidDate) {
        formattedDate = formattedDate.substring(0, formattedDate.lastIndexOf("/") + 1);
      }
    }
  
    setBirthDate(formattedDate);
  };

  const cepHandleChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

    if(numericValue.length === 8){
      console.log(numericValue)
      getAddress(numericValue)
    }
  
    // Aplica a máscara
    const formattedCep = numericValue
      .replace(/^(\d{5})(\d)/, "$1-$2") // Adiciona o hífen após os 5 primeiros dígitos
      .substring(0, 9);                // Limita ao tamanho de um CEP (8 dígitos + hífen)
  
    setCep(formattedCep);
  };

  //Buscador de CEp
  async function buscarEnderecoPorCEP(cep) {
    try {
      // Remove traços ou espaços do CEP
      const cepFormatado = cep.replace(/\D/g, '');
  
      // Faz a requisição para a API do ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro na requisição à API.');
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
  
      // Verifica se o CEP foi encontrado
      if (data.erro) {
        throw new Error('CEP não encontrado!');
      }
  
      // Extrai os dados necessários
      const { bairro, localidade: cidade, uf: estado } = data;

      setError("")
  
      return { bairro, cidade, estado };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error.message);
      setError(error.message)
      throw error;
    } 
  }



  // Exemplo de uso
  async function getAddress(cep){
    // const cep = '64066475'; // CEP de exemplo
    try {
      const endereco = await buscarEnderecoPorCEP(cep);
      console.log('Endereço:', endereco);
      setState(endereco.estado)
      setCity(endereco.cidade)
      setNeighborhood(endereco.bairro)
    } catch (error) {
      console.error('Erro:', error.message);
    }
  }

  return (
    <main className='Sing'>
      <div className='container'>
        <div className='register' style={step === 1 ? {display: "block"} : {display: "none"}}>
          <section className='text'>
            <div className='icon'>
              <FaUserPlus />
            </div>
            <p>Novo Cliente</p>
            <p>Criar uma conta é fácil!</p>
          </section>
          <form onSubmit={(e) => {e.preventDefault(); setStep(2)}}>
            <input type="email" name='email' placeholder='Email' autoComplete='email' required onChange={(e) => {setUserEmail(e.target.value)}}/>
            <input type="password" name='password' placeholder='Senha' autoComplete="current-password" required onChange={(e) => {setUserPassword(e.target.value)}}/>
            <input type="password" name='confirmPassword' placeholder='Repetir senha' required onChange={(e) => {setUserConfirmPassword(e.target.value)}}/>
            <button type='submit'>Continuar</button>
            <GoogleAuth btnTitle="Registre-se com o Google"/>
          </form>
          <section className='anotherForm'>
            <p>Já tem uma conta? <Link to="/entrar">Entrar</Link></p>
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </section>
        </div>

        <section className='identification' style={step === 2 ? {display: "block"} : {display: "none"}}>
          <div className='text'>
            <div className='icon'>
              <HiMiniIdentification />
            </div>
            <p>Identificação</p>
            <p>Confirme seus dados</p>
          </div>
          <form onSubmit={(e) => {e.preventDefault(); setStep(3)}}>
            <input type="text" name='name' placeholder='Nome de completo' required onChange={(e) => {setUserName(e.target.value)}}/>
            <input type="text" name='cpf' placeholder='CPF' value={cpf} required onChange={cpfHandleChange}/>
            <input type="text" name='phone' placeholder='Celular' required value={phoneNumber} onChange={phoneHandleChange}/>
            <select defaultValue="undefined" required onChange={(e) => {setGender(e.target.value)}}>
              <option value="undefined" disabled>Sexo</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
            <input type="text" placeholder='Data de nascimento' value={birthDate} required onChange={birthDateHandleChange}/>
            <button type='button' className='return' onClick={(e) => {e.preventDefault(); setStep(step - 1)}}>Voltar</button>
            <button type='submit'>Continuar</button>
          </form>
          <div className='anotherForm'>
            {/* <p>Já tem uma conta? <Link to="/entrar">Entrar</Link></p> */}
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </div>
        </section>

        <section className='address' style={step === 3 ? {display: "block"} : {display: "none"}}>
          <div className='text'>
            <div className='icon'>
              <HiHomeModern />
            </div>
            <p>Endereço</p>
            <p>Informe seu endereço</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='cep' placeholder='CEP' value={cep} required onChange={cepHandleChange}/>
            <input type="text" name='address' placeholder='Endereço' required onChange={(e) => {setAddress(e.target.value)}}/>
            <input type="text" name='complemento' placeholder='Complemento' onChange={(e) => {setComplement(e.target.value)}}/>
            <input type="text" name='addressNumber' placeholder='Número' required onChange={(e) => {setAddressNumber(e.target.value)}}/>
            <input type='text' name='estado' placeholder='UF' value={state} title='Estado' disabled />
            <input type='text' name='cidade' placeholder='Cidade' value={city} title='Cidade' disabled />
            <input type='text' name='bairro' placeholder='Bairro' value={neighborhood} title='Bairro' disabled />
            <button type='button' className='return' onClick={(e) => {e.preventDefault(); setStep(step - 1)}}>Voltar</button>
            <button type='submit'>Criar Conta</button>
          </form>
          <div className='anotherForm'>
            {/* <p>Já tem uma conta? <Link to="/entrar">Entrar</Link></p> */}
            <p className='errorMsg' style={error ? {display: 'block'} : {display: "none"}}>{error}</p>
          </div>
        </section>

      </div>
    </main>
  );
}

export default SingUp;