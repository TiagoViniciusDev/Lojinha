import './ProductsAdm.css';
import api from '../../api/api.js'

import { useState, useRef, useEffect } from 'react';

import { IoFilter } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function ProductsAdm() {

  const { user, setLoading } = useContext(UserContext)

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const inputFileRef = useRef(null);

  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);
  const [productName, setProductName] = useState()
  const [productDesc, setProductDesc] = useState()
  const [productCategory, setProductCategory] = useState()
  const [productPrice, setProductPrice] = useState()
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState()


  useEffect(() => {
    getAllProducts()
    getAllCategories()
  },[])

  async function getAllCategories(){
    setLoading(true)

    const response = await api('GET', `/productCategories`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setCategories(backendMsg.allCategories)
    } else{
        alert("Falha ao carregar categorias")
        setCategories()
    }
  }

  async function getAllProducts(){
    setLoading(true)

    const response = await api('GET', `/product/allProducts`);
    const backendMsg = await response.json();

    setLoading(false)
    
    if(backendMsg.success == true){
        setAllProducts(backendMsg.Products)
    } else{
        alert("Falha ao carregar produtos")
        setAllProducts([])
    }
  }

  function handleImageClick(){
    inputFileRef.current.click();
  }

  //Upload de Imgs
  const [files, setFiles] = useState(null);

  // Função para capturar o arquivo do input
  const handleFileChange = (e) => {
    setFiles(e.target.files);

    //Capturado imgs para exibir no front
    setSelectedImages([])
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
  };

  // Função para enviar o arquivo para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      alert("Selecione um arquivo primeiro.");
      return;
    }

    const uploadedUrls = await uploadImgs();
    if (uploadedUrls) {
      createProduct(uploadedUrls);
    }
  };

  async function uploadImgs() {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  
    try {
      const response = await fetch(`${baseURL}/product/uploadImgs`, {
        userID: user._id,
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Arquivos enviados com sucesso:", result);
  
        const dataUrls = result.files.map((file) => file.url);
        return dataUrls;  // Retorna as URLs carregadas
      } else {
        console.log("Error here")
        console.error("Erro ao enviar arquivo(s):", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      return null;
    }
  }

  async function createProduct(productImgsUrls){
    setLoading(true)
    try {

      if(!productCategory || productCategory == "" || productCategory == "undefined"){
        setLoading(false)
        return alert("Selecione a categoria do produto")
      }

      const dataObj = {
        userID: user._id,
        name: productName,
        desc: productDesc,
        price: productPrice,
        category: productCategory,
        imgs: productImgsUrls
    }

    const response = await api('POST', '/product/newProduct', dataObj)
    const backendMsg = await response.json()

    if(backendMsg.success === false){
      return alert(backendMsg.msg)
    } else{
      setShowNewProductForm(false)
      alert(backendMsg.msg)
      getAllProducts()
    }
    } catch (error) {
      alert("Erro na requisição")
      console.error("Erro na requisição:", error);
    }
    setLoading(false)
  }

  async function deleteProduct(id, name){
    console.log("Id produto")
    console.log(id)

    const userConfirmed = confirm(`Deletar produto "${name}" ? Essa ação é irrevessível`)

    if (!userConfirmed) {
      return
    }

    setLoading(true)
      try {
        const dataObj = {
          userID: user._id,
          productID: id
        };
  
        const response = await api('DELETE', '/product/deleteProduct', dataObj);
        const backendMsg = await response.json();
        
        if(backendMsg.success == true){
            alert("Produto deletado com sucesso")
            getAllProducts()
        } else{
            alert(backendMsg.msg)
        }

      } catch (error) {
        console.log(error)
        alert("Erro ao tentar deletar produto")
      }

    setLoading(false)
  }


  return (
    <main className='ProductsAdm'>
        <section className='btnsOptions'>
            <button onClick={() => {setShowNewProductForm(true)}}>Novo Produto</button>
        </section>
        <form className='newProductForm' style={showNewProductForm ? {display: "flex"} : {display: "none"}} onSubmit={handleSubmit}>
          <div className='uploadImgs' onClick={handleImageClick}>
            <input type="file" ref={inputFileRef} accept='image/*' multiple style={{ display: 'none' }} onChange={handleFileChange}/>
            <div className='uploadInfo' style={selectedImages && selectedImages.length > 0 ? {display: "none"} : {display: "flex"}}>
              <CiImageOn />
              <p>Clique aqui para selecionar as imagens</p>
              <p>Recomendamos imagens com proporção 1:1 (1080x1080)</p>
            </div>
            <div className='selectedImgs'>
              {selectedImages ? selectedImages.map((img) => (
                // console.log(img)
                <img key={img} src={img}/>
              )) : <p>Não há imagens</p>}
            </div>
          </div>
          <div className='infoProduct'>
            <input type='text' placeholder='Nome do produto' required onChange={(e) => {setProductName(e.target.value)}}/>
            <textarea placeholder='Descrição do Produto' required onChange={(e) => {setProductDesc(e.target.value)}}></textarea>
            <select defaultValue="undefined" onChange={(e) => {setProductCategory(e.target.value)}}>
              <option value="undefined" disabled>Selecione</option>
              {categories ? categories.map((categoryOption) => (
                <option key={categoryOption._id} value={categoryOption.categoryName}>{categoryOption.categoryName}</option>
              )) : "" }
            </select>
            <input type='number' placeholder='Preço do Produto' required onChange={(e) => {setProductPrice(e.target.value)}}/>
            <div className='btns'>
              <button type='reset' onClick={() => {setShowNewProductForm(false)}}>Cancelar</button>
              <button type='submit'>Criar Produto</button>
            </div>
          </div>
        </form>
        <section className='productsAdmHeader'>
            <h3>Produtos</h3>
            <div className='productsFilter'>
              <input type="text" placeholder='Pesquisar'/>
              <IoFilter />
            </div>
        </section>

        <section className='products'>
          {allProducts && allProducts.length > 0 ? allProducts.map((product) => (
              <div className='product' key={product._id}>
                <div className='productImg' style={{backgroundImage: `url(${product.imgs[0]})`}}></div>
                <div className='info'>
                  <p>{product.name}</p>
                  <p>R$ {product.price}</p>
                  <p>ou 10x de R${product.price/10}</p>
                  <div className='productBtns'>
                    <button>Editar Produto</button>
                    <button onClick={() => {deleteProduct(product._id, product.name)}}>Deletar Produto</button>
                  </div>
                </div>
              </div>
          )) : <p>Não há produtos</p>}
        </section>
    </main>
  );
}

export default ProductsAdm;