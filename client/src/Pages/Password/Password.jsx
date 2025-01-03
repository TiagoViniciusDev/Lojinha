import './Password.css';

function Password() {
  return (
    <main className='Password'>
        <div className='item'>
            <h3>Alterar senha</h3>
            <form>
                <p>Preencha os campos abaixo</p>
                <input type="text" placeholder='Senha Atual' required/>
                <input type="text" placeholder='Nova Senha' required/>
                <input type="text" placeholder='Confirmar Nova Senha' required/>
                <div className='buttons'>
                    <button type='reset'>Cancelar</button>
                    <button type='submit'>Alterar Senha</button>
                </div>
            </form>
        </div>
    </main>
  );
}

export default Password;