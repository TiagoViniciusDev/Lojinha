import './MyAccount.css';

import { FaUnlock } from "react-icons/fa";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function MyAccount() {

  const { user } = useContext(UserContext)

  return (
    <main className='MyAccount'>
        <section className='item'>
          <h3>Dados Cadastrais</h3>
          <p><span>Email:</span> {user.email}</p>
          <p><span>Nome:</span> {user.username}</p>
          <p><span>CPF:</span> {user.cpf}</p>
          <p><span>Sexo:</span> {user.gender}</p>
          <p><span>Nascimento:</span> {user.birthDate}</p>
          <p><span>Celular:</span> {user.phoneNumber}</p>
          <div className='buttons'>
            <button>
              <FaUnlock />
              <p>Alterar senha</p>
            </button>
            <button>Editar</button>
          </div>
        </section>

        <section className='item'>
          <h3>Endereço</h3>
          <p><span>Cep:</span> {user.cep}</p>
          <p><span>Endereço:</span> {user.address}</p>
          <p><span>Número:</span> {user.addressNumber}</p>
          <p><span>Bairro:</span> {user.neighborhood}</p>
          <p><span>Cidade:</span> {user.city}</p>
          <p><span>Estado:</span> {user.UF}</p>
          <div className='buttons'>
            <button>Editar Endereço</button>
          </div>
        </section>
    </main>
  );
}

export default MyAccount;