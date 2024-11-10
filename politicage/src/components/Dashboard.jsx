import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export function Dashboard() {
  const [estatisticas, setEstatisticas] = useState({
    totalDeputados: 0,
    partidosRepresentados: 0, 
    projetosLei: 0
  });
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuario, setUsuario] = useState({ nome: 'Cidadão' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deputadosResponse = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados');
        const totalDeputados = deputadosResponse.data.dados.length;

        const partidosResponse = await axios.get('https://dadosabertos.camara.leg.br/api/v2/partidos');
        const partidosRepresentados = partidosResponse.data.dados.length;

        const projetosResponse = await axios.get('https://dadosabertos.camara.leg.br/api/v2/proposicoes?siglaTipo=PL&ordem=DESC&ordenarPor=id&itens=100');
        const projetosLei = projetosResponse.data.dados.length;

        setEstatisticas({
          totalDeputados,
          partidosRepresentados,
          projetosLei
        });

        const ultimosProjetosNotificacoes = projetosResponse.data.dados.slice(0, 3).map(projeto => ({
          id: projeto.id,
          mensagem: `Novo projeto de lei: ${projeto.ementa.substring(0, 50)}...`
        }));
        setNotificacoes(ultimosProjetosNotificacoes);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Bem-vindo, {usuario.nome}</h1>
      </div>
      <div className="estatisticas-rapidas">
        <h2>Estatísticas Rápidas</h2>
        <div className="estatisticas-grid">
          <div className="estatistica-item">
            <h3>Total de Deputados</h3>
            <p>{estatisticas.totalDeputados}</p>
          </div>
          <div className="estatistica-item">
            <h3>Partidos Representados</h3>
            <p>{estatisticas.partidosRepresentados}</p>
          </div>
          <div className="estatistica-item">
            <h3>Projetos de Lei Recentes</h3>
            <p>{estatisticas.projetosLei}</p>
          </div>
        </div>
      </div>
      <div className="funcionalidades-principais">
        <h2>Deputados</h2>
        <div className="funcionalidades-grid">
          <Link to="/buscar-politicos" className="funcionalidade-item">Pesquisar</Link>
          <a href="https://dadosabertos.camara.leg.br/" target="_blank" rel="noopener noreferrer" className="funcionalidade-item">Fonte</a>
        </div>
      </div>
      <div className="notificacoes">
        <h2>Notificações Recentes</h2>
        <ul>
          {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <li key={notificacao.id}>
                <Link to={`/projeto/${notificacao.id}`}>{notificacao.mensagem}</Link>
              </li>
            ))
          ) : (
            <p>Nenhuma notificação recente.</p>
          )}
        </ul>
      </div>
    </div>
  );
}