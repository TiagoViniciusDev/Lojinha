import './Cart.css';
import api from '../../api/api'
import ProductUserContainer from '../../Components/ProductUserContainer/ProductUserContainer';

import { useEffect, useState } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Cart() {

  const { user, setLoading } = useContext(UserContext)

  const [cartProducts, setCartProducts] = useState([])

  useEffect(() => {
    if(user.cart.length > 0){
      getCartItems()
    }
  },[user])

  async function getCartItems(){
    setLoading(true)

    try {
      const requestBody = {
        products: user.cart
      }
  
      const response = await api("POST", "/product/products", requestBody)
      const backendMsg = await response.json()
      

      if(backendMsg.success === false){
        setLoading(false)
        return console.log(backendMsg.msg)
      }

      setCartProducts(backendMsg.products)


    } catch (error) {
      console.log(error)
      alert("Falha ao carregar produtos do carrinho")
    }
    setLoading(false)
  }

  return (
    <main className='Cart list'>
      {cartProducts ? cartProducts.map((product) => (
        <div key={product._id}>
          <ProductUserContainer id={product._id} img={product.imgs[0]} name={product.name} price={product.price}/>
        </div>
      )) : <p>Loading...</p>}

      <div style={user.cart.length === 0 ? {display: "block"} : {display: 'none'}}>
        <h3>Carrinho</h3>
        <p>Você ainda não tem não tem itens no carrinho</p>
      </div>
    </main>
  );
}

export default Cart;