import './AdmSideBar.css';

import {useNavigate} from 'react-router-dom'

import { FaChartBar } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaBoxArchive } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";

function AdmSideBar() {
 
  const navigate = useNavigate()

  const url = window.location.href;
  const lastPart = url.split('/').pop();

  return (
    <aside className='AdmSideBar'>
        <div className='item dashboard' style={lastPart == "access" ? {borderRight: "3px solid var(--AdmMainColor2)"} : {}} onClick={() => navigate("/admin/access")}>
            <FaChartBar />
            <p>Dashboard</p>
        </div>
        <div className='item dashboard' style={lastPart == "categorias" ? {borderRight: "3px solid var(--AdmMainColor2)"} : {}} onClick={() => navigate("/admin/access/categorias")}>
            <BiSolidCategory />
            <p>Categorias</p>
        </div>
        <div className='item dashboard' style={lastPart == "produtos" ? {borderRight: "3px solid var(--AdmMainColor2)"} : {}} onClick={() => navigate("/admin/access/produtos")}>
            <FaBoxArchive />
            <p>Produtos</p>
        </div>
        <div className='item dashboard' style={lastPart == "pedidos" ? {borderRight: "3px solid var(--AdmMainColor2)"} : {}} onClick={() => navigate("/admin/access/pedidos")}>
            <FaClipboardList />
            <p>Pedidos</p>
        </div>
    </aside>
  );
}

export default AdmSideBar;