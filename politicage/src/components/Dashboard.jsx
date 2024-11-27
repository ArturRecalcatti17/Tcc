import '../styles/dashboard.css'
import logo from '../assets/logo.svg';
import homemDeTerno from '../assets/homemDeTerno.png'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export function Dashboard() {
  const [deputadoAleatorio, setDeputadoAleatorio] = useState(null);
  const usuarioNome = localStorage.getItem('usuarioNome');

  useEffect(() => {
    const fetchDeputados = async () => {
      try {
        const response = await api.get('/deputados?ordem=ASC&ordenarPor=nome');
        const deputados = response.data.dados;

        const randomIndex = Math.floor(Math.random() * deputados.length);
        const deputado = deputados[randomIndex];

        const deputadoData = {
          estado: deputado.siglaUf,
          detalhes: `${deputado.nome} - ${deputado.siglaPartido}`,
          id: deputado.id
        };
        setDeputadoAleatorio(deputadoData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDeputados();
  }, []);

  const ultimoDeputadoId = localStorage.getItem('ultimoDeputadoId');
  return (
    <>
      <section>
        <div className="firstPanel">
          <div className="leftCard">
            <h1 className='tittle fl'>Seu Perfil</h1>
            <Link to="/configuracoes-usuario">
              <p>{usuarioNome?.split(' ')[0] || 'Usuário'}</p>
            </Link>
            <hr />
            <Link to="/buscar-politicos"><p>Pesquisar</p></Link>
            <hr />
            <Link to={ultimoDeputadoId ? `/politico/${ultimoDeputadoId}` : '/buscar-politicos'}>
              Ultimo <br />Deputado
            </Link>
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
                <img className='davi' src="" alt="" />
                <img className='artur' src="" alt="" />
              </div>
            </div>
            <img className='logo' src={logo} alt="Politicage" />
          </div>
        </div>

        <div className="secondPanel">
          <div className="leftCard">
            <h1 className='tittle sl'>Deputados</h1>
            <Link to="/buscar-politicos"><p>Pesquisar</p></Link>
            <hr />
            <a href="https://dadosabertos.camara.leg.br/api/v2/deputados"
              target="_blank"
              rel="noopener noreferrer">
              Fonte
            </a>
          </div>

          <div className="rightCard">
            <h1 className='tittle'>Conheça o Deputado</h1>
            {deputadoAleatorio ? (
              <>
                <p className='link'>{deputadoAleatorio.detalhes}</p>
                <hr />
                <p className='link'>{deputadoAleatorio.estado}</p>
                <hr />
                <Link to={`/politico/${deputadoAleatorio.id}`}><p>Histórico</p></Link>
              </>
            ) : (
              <p className='carregando'>Carregando dados do deputado...</p>
            )}
            <img src={homemDeTerno} alt="homemDeTerno" />
          </div>
        </div>
      </section>
    </>
  );
}