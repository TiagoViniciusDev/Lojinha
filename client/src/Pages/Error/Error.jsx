import './Error.css';

function Error() {
  return (
    <main className='Error'>
        <div className='title'>
            <img src="/erro.png" alt="erroImg" />
            <h2>ERRO</h2>
        </div>
        <p>Não foi possível localizar a página</p>
        <a href="/">Voltar para página Inicial</a>
    </main>
  );
}

export default Error;