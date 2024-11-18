import '../styles/dashboard.css'
import logo from '../assets/logo.svg';

export function Dashboard(){
  return (

    <>
    <section>
      <div className="firstPanel">




        <div className="leftCard">
          <h1 className='tittle fl'>Seu Perfil</h1>

          <a href=""><p>{(localStorage.getItem('usuarioNome') || usuario[0].nome).split(' ')[0]}</p></a>
          <hr/>
          <a href=""><p>Pesquisar</p></a>
          <hr />
          <a href="">Ultimo <br />Deputado</a>
        </div>



        <div className="rightCard">
          <h1 className='tittle fr'>Bem-vindo cidadão</h1>
          <div className="conjunto">

          <p className='legenda'>O Politicagem é um trabalho de conclusão de 
            curso criado pelos alunos Artur Bordignon e 
            Davi Steiner. A nossa ideia é criar um site 
            onde qualquer pessoa possa acessar e ter acesso 
            aos dados e informações de deputados.
          </p>
          <div className="fotos">
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          </div>
          <img className='logo' src={logo} alt="Politicage" />
        </div>
      </div>



      <div className="secondPanel">
        <div className="leftCard">
          <h1 className='tittle sl'>Deputados</h1>
        </div>
        <div className="rightCard">
          <h1 className='tittle'>Conheça o Deputado</h1>
        </div>
      </div>
    </section>

    </>

  );  
}
