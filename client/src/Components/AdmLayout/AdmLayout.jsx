import './AdmLayout.css'
import AdmSideBar from "../AdmSideBar/AdmSideBar";
import Loading from "../Loading/Loading"

import { Outlet } from "react-router-dom"

function AdmLayout() {
  return (
    <div className='AdmLayout'>
        <Loading />
        <div className="content">
          <AdmSideBar />
          <div className='outletContainer'>
            <Outlet />
          </div>
        </div>
    </div>
  );
}

export default AdmLayout;