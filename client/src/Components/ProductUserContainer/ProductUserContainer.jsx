import './ProductUserContainer.css';
import api from '../../api/api'

import { IoMdClose } from "react-icons/io";

import { useEffect, useState } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function ProductUserContainer({id, img, name, price}) {

  const { user, setUser, setLoading } = useContext(UserContext)

  const [error, setError] = useState("")


  async function removeItemFromCart(productID){
    if(!user){
      return alert("Faça login para poder remover itens ao carrinho")
    }

    setLoading(true)

    try {

      const filteredArray = user.cart.filter(item => item !== productID);

      const requestBody = {
        userID: user._id,
        cart: filteredArray
      }

      // console.log(user.cart)
      // console.log(filteredArray)
  
      const response = await api("PUT", "/user/update", requestBody)
      const backendMsg = await response.json()
      
      if(backendMsg.success === false){
        setLoading(false)
        alert(backendMsg.msg)
        return
      }
      
      setUser(backendMsg.updatedUser)
      sessionStorage.setItem('user', JSON.stringify(backendMsg.updatedUser))
      alert("Item removido com sucesso ao carrinho")
    } catch (error) {
      console.log(error)
      alert("Falha ao remover item ao carrinho")
    }

    setLoading(false)
  }

  return (
    <div className='ProductUserContainer'>
        <div>
            <div className='productImg' style={{backgroundImage: `url(${img})`}}></div>
            <p>{name}</p>
        </div>

        <div>
          <p>R$ {price},00</p>
        </div>

        <div>
          <IoMdClose title='Remover' onClick={() => {removeItemFromCart(id)}}/>
        </div>
    </div>
  );
}

export default ProductUserContainer;