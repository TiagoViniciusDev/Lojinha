import './Loading.css';

import { AiOutlineLoading3Quarters } from "react-icons/ai";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Loading() {

  const {loading} = useContext(UserContext)

  return (
    <div className='Loading' style={loading ? {display: "block"} : {display: "none"}}>
        <div className='loadingContent'>
            <AiOutlineLoading3Quarters />
            <p>Carregando...</p>
        </div>
    </div>
  );
}

export default Loading;