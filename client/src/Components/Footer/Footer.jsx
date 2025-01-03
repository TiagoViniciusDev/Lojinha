import './Footer.css';

function Footer() {
  return (
    <footer className='Footer'>
        <div className='container'>
            <div className='footerMain'>
                <section className='part1'>
                    <h2>Lojinha</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a euismod neque. Proin mattis metus in sapien pretium, non tincidunt dui molestie. Nullam tempus venenatis erat vel pretium. Morbi luctus dictum augue ullamcorper tempus. Vivamus quis porttitor lorem. Nullam ac elit nec nisl venenatis congue sit amet et dolor.</p>
                </section>

                <section className='part2'>
                    <nav>
                        <p>Conteúdo</p>
                        <a href="">Fale Conosco</a>
                        <a href="">Garantias</a>
                        <a href="">Política de Privacidade</a>
                        <a href="">Política de troca e devolução</a>
                    </nav>

                    <nav>
                        <p>Quem somos?</p>
                        <a href="">Fale Conosco</a>
                        <a href="">Sobre nós</a>
                        <a href="">Entre em contato</a>
                    </nav>
                </section>
            </div>
            <p>Lojinha - 2024 © Todos os direitos reservados</p>
        </div>
    </footer>
  );
}

export default Footer;