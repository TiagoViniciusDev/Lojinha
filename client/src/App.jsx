import './App.css'
import Home from './Pages/Home/Home'
import Layout from './Components/Layout/Layout'
import SingIn from './Pages/SingIn/SingIn'
import SingUp from './Pages/SingUp/SingUp'
import Error from './Pages/Error/Error'
import AdmSingIn from './Pages/AdmSingIn/AdmSingIn'
import AdmLayout from './Components/AdmLayout/AdmLayout'
import Dashboard from './Pages/Dashboard/Dashboard'
import CategoriesAdm from './Pages/CategoriesAdm/CategoriesAdm'
import ProductsAdm from './Pages/ProductsAdm/ProductsAdm'
import OrdersAdm from './Pages/OrdersAdm/OrdersAdm'
import Product from './Pages/Product/Product'
import Search from './Pages/Search/Search'
import UserLayout from './Components/UserLayout/UserLayout'
import MyAccount from './Pages/MyAccount/MyAccount'
import Password from './Pages/Password/Password'
import MyOrders from './Pages/MyOrders/MyOrders'
import Cart from './Pages/Cart/Cart'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Error />}/>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path='/entrar' element={<SingIn />}/>
            <Route path='/registre-se' element={<SingUp />}/>
            <Route path='/produto/:id' element={<Product />}/>
            <Route path='/buscar' element={<Search />}/>
            <Route path='/usuário' element={<UserLayout />}>
              <Route index element={<MyAccount />}/>
              <Route path='alterar-senha' element={<Password />}/>
              <Route path='meus-pedidos' element={<MyOrders />}/>
              <Route path='carrinho' element={<Cart />}/>
            </Route>
          </Route>

          <Route path="/admin" element={<AdmSingIn />}></Route>

          <Route path="/admin/access" element={<AdmLayout />}>
            <Route index element={<Dashboard />}/>
            <Route path='categorias' element={<CategoriesAdm />}/>
            <Route path='produtos' element={<ProductsAdm />}/>
            <Route path='pedidos' element={<OrdersAdm />}/>
          </Route>
    
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
