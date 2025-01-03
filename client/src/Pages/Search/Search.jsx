import './Search.css';
import api from '../../api/api'
import ProductContainer from '../../Components/ProductContainer/ProductContainer';

import { useEffect, useState } from 'react';

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Search() {

  const { setLoading } = useContext(UserContext)
  const [searchResult, setSearchResult] = useState()
  const [categories, setCategories] = useState()
  const [url, setUrl] = useState(window.location.href)

  useEffect(() => {
    getAllCategories()
  },[])

  useEffect(() => { //Capturando url da página e suas mudanças:

    const handleUrlChange = () => {
      setUrl(window.location.href);
    };

    // Captura mudanças na URL com popstate e hashchange
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Caso você use pushState ou replaceState, sobrescreva-os como mostrado antes
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const urlParts = url.split('/');
  const decodeURL3 = decodeURIComponent(urlParts[3])

  useEffect(() => { //Caregando produtos
    searchProducts()
  },[url])

  async function searchProducts(){
    setLoading(true)

    try {
      let query = "/product/allProducts"
      if(decodeURL3.includes("?")){
        query = `/product/allProducts?${decodeURL3.split("?")[1]}`
      }

      const response = await api('GET', `${query}`);
      const backendMsg = await response.json();
      
      if(backendMsg.success == true){
          setSearchResult(backendMsg.Products)
      } else{
          setSearchResult()
          alert("Falha ao carregar seus produtos")
      }
    } catch (error) {
      alert("Falha ao carregar produtos")
      console.log(error)
    }

    setLoading(false)
  }

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

  function handleCategory(selectedCategory){
    if(selectedCategory !== "all" && selectedCategory !== undefined){
      if (url.includes("search")) {
      //Remover todo texto depois de "&" tirando qualquer query de categoria
      const result = url.split("&")[0].trim(); // Pega o texto antes de "&" e remove espaços extras
      //Adicionar categoria ao final
      window.location.href = `${result}&categoria=${selectedCategory}`
      } else{
        if (url.includes("?")) { //Verificando se já tem a interrogação
          if(url.includes("&")){
            const result = url.split("&")[0].trim(); //Remover todo texto depois de "&" tirando qualquer query de categoria
            window.location.href = `${result}&categoria=${selectedCategory}` //Adicionar categoria ao final // Sem "?"
          } else{
            const index = url.indexOf("categoria");
            const result = index !== -1 ? url.substring(0, index) : url // Pegar tudo antes da palavra "categoria"
            window.location.href = `${result}&categoria=${selectedCategory}`
          }
        } else{
          const result = url.split("&")[0].trim(); // Pega o texto antes de "&" e remove espaços extras
          window.location.href = `${result}?&categoria=${selectedCategory}` //Adicionar categoria ao final // Com "?"
        }
      }
    } else{
      //Remover todo texto depois de "&" tirando qualquer query de categoria
      const result = url.split("&")[0].trim(); // Pega o texto antes de "&" e remove espaços extras
      window.location.href = result
    }
  }

  return (
    <main className='Search'>
      <div className='container'>
        <section className='header'>
          <h2>Produtos</h2>
          <form action="">
            <select value={url.includes("categoria") ? decodeURIComponent(url.split("categoria=")[1].trim()) : "all"} onChange={(e) => {handleCategory(e.target.value)}}>
              <option value="all">Todas as categorias</option>
              {categories ? categories.map((item) => (
                <option key={item._id} value={item.categoryName}>{item.categoryName}</option>
              )) : ''}
            </select>
            <button type='submit'>Buscar</button>
          </form>
        </section>
        <section className='products'>
          {searchResult && searchResult.length > 0 ? searchResult.map((produto) => (
            <ProductContainer productData={produto} key={produto._id}/>
          )) : searchResult && searchResult.length == 0 ? <p>Não nenhum produto encontrado</p> : <p>Loading</p>}
        </section>
      </div>
    </main>
  );
}

export default Search;