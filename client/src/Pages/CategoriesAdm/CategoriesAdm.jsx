import './CategoriesAdm.css';
import api from '../../api/api.js'

import { useState, useEffect } from 'react';

import { IoIosAdd } from "react-icons/io";

//context
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function CategoriesAdm() {

  const { user, setLoading } = useContext(UserContext)

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [categoryName, setCategoryName] = useState()
  const [categories, setCategories] = useState()
  const [editCategoryName, setEditCategoryName] = useState()

  useEffect(() => {
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

  async function createNewCategory(e){
    e.preventDefault()
    setLoading(true)

    const body = {
        userID: user._id,
        categoryName: categoryName,
    }

    const response = await api('POST', `/productCategories/newCategory`, body);
    const backendMsg = await response.json();
 
    setLoading(false)
    
    if(backendMsg.success == true){
        alert(backendMsg.msg)
        setShowNewCategoryForm(false)
        getAllCategories() //refresh
        setCategoryName()
    } else{
        alert(backendMsg.msg)
    }
  }

  async function deleteCategory(categoryID, categoryName, e) {
    e.preventDefault()

    const text = `Deseja deletar a categoria "${categoryName}" ? Essa ação é irrevessível`
    if(confirm(text) == true){
      setLoading(true)

      const body = {
        userID: user._id,
        categoryID: categoryID
      }
  
      const response = await api('DELETE', `/productCategories/deleteById`, body);
      const backendMsg = await response.json();
  
      setLoading(false)
      
      if(backendMsg.success == true){
          alert(backendMsg.msg)
          getAllCategories() //refresh
      } else{
          alert(backendMsg.msg)
      }
    }
  }

  async function editCategory(category, e) {
    e.preventDefault()

    setLoading(true)

    if(editCategoryName == category.categoryName){
      return alert("Não houve alteração no nome")
    }

    if(editCategoryName == "" || editCategoryName == undefined || !editCategory){
      console.log(editCategory)
      alert("Falha ao tentar atualizar categoria")
      return
    }

    const body = {
        userID: user._id,
        categoryID: category._id,
        categoryName: editCategoryName
    }

    const response = await api('POST', `/productCategories/editCategory`, body);
    const backendMsg = await response.json();
  
    setLoading(false)
    
    if(backendMsg.success == true){
        alert(backendMsg.msg)
        getAllCategories() //refresh
    } else{
        alert(backendMsg.msg)
    }
  }

  return (
    <main className='CategoriesAdm'>
      <h3>Todas as Categorias</h3>
      <div className='categories'>

        {categories ? categories.map((category) => (
          <div className='categoryItem' key={category._id}>
            <form className='edit' onSubmit={(e) => {editCategory(category, e)}}>
              <input type="text" defaultValue={category.categoryName} placeholder='Nome da categoria' onChange={(e) => {setEditCategoryName(e.target.value)}}/>
              <div className='btns'>
                <button onClick={(e) => {deleteCategory(category._id, category.categoryName, e)}}>Deletar</button>
                <button type='reset'>Cancelar</button>
                <button type='submit'>Salvar</button>
              </div>
            </form>
          </div>
        )) : <h2>Carregando</h2>}

        <div className='categoryItem newCategory' title='Criar Nova Categoria' onClick={() => {showNewCategoryForm ? "" : setShowNewCategoryForm(true)}}>
          <IoIosAdd style={showNewCategoryForm ? {display: "none"} : {display: "block"}} />
          <form className='edit' style={showNewCategoryForm ? {display: "flex"} : {display: "none"}} onSubmit={createNewCategory}>
            <input type="text" placeholder='Nome da categoria' onChange={(e) => {setCategoryName(e.target.value)}}/>
            <div className='btns'>
              <button onClick={(e) => {e.preventDefault(); setShowNewCategoryForm(false)}}>Cancelar</button>
              <button type='submit'>Criar Categoria</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CategoriesAdm;