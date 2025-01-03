import { Outlet } from "react-router-dom"

import Loading from "../Loading/Loading"
import Header from "../Header/Header"
import Footer from '../Footer/Footer'

function Layout() {
  return (
    <div>
        <Loading />
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout