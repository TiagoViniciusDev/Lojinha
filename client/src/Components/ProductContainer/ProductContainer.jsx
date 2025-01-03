import './ProductContainer.css';
import api from '../../api/api.js'

import { FaShoppingCart } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function ProductContainer({productData}) {

  const { user, setUser, setLoading } = useContext(UserContext)
 
  const navigate = useNavigate()

  function productPage(productID){
    navigate(`/produto/${productID}`)
  }

  async function addItemToCart(productID){

    if(!user){
      return alert("Faça login para poder adicionar itens ao carrinho")
    }

    setLoading(true)

    try {

      // var cart1 = user.cart
      const requestBody = {
        userID: user._id,
        cart: [...user.cart, productID]
      }
  
      const response = await api("PUT", "/user/update", requestBody)
      const backendMsg = await response.json()
      
      if(backendMsg.success === false){
        setLoading(false)
        console.log(backendMsg)
        alert(backendMsg.msg)
        return
      }
      
      setUser(backendMsg.updatedUser)
      sessionStorage.setItem('user', JSON.stringify(backendMsg.updatedUser))
      alert("Item adicionado com sucesso ao carrinho")
    } catch (error) {
      console.log(error)
      alert("Falha ao adicionar item ao carrinho")
    }

    setLoading(false)
  }

  return (
    <div className='ProductContainer'>
        <div className='productImg' style={{backgroundImage: `url(${productData.imgs[0]})`}} onClick={() => {productPage(productData._id)}}></div>
          <div className='text'>
            <p>{productData.name}</p>
            <div className='price'>
              <p>De <span>R$ {productData.price + productData.price*0.2},00</span></p>
              <p>R$ {productData.price},00</p>
              <p>Até 3x de R$ {Math.ceil((productData.price + productData.price*0.2)/3)},00</p>
            </div>
            <div className='buttons'>
              <button onClick={() => {addItemToCart(productData._id)}}>
                <FaShoppingCart />
                Adicionar ao carrinho
              </button>
              <button onClick={() => {productPage(productData._id)}}>
                Ver Produto
              </button>
            </div>
          </div>
    </div>
  );
}

export default ProductContainer;