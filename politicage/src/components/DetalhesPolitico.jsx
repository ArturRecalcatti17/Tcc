import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/detalhesPolitico.css';

export function DetalhesPolitico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [politico, setPolitico] = useState(null);
  const [proposicoes, setProposicoes] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const politicoRes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`);
        setPolitico(politicoRes.data.dados);
      } catch (error) {
        console.error('Erro ao buscar dados do político:', error);
        setError('Não foi possível carregar os dados do político.');
      }

      try {
        const proposicoesRes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/proposicoes`);
        if (proposicoesRes.data.dados) {
          setProposicoes(proposicoesRes.data.dados.slice(0, 5));
        } else {
          setProposicoes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar proposições:', error);
        setProposicoes([]);
      }

      try {
        const despesasRes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/despesas?ordem=DESC&ordenarPor=ano`);
        if (despesasRes.data.dados) {
          setDespesas(despesasRes.data.dados.slice());
        } else {
          setDespesas([]);
        }
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
        setDespesas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!politico) return <div>Político não encontrado</div>;

  return (
    <div className="detalhes-politico">
      <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
      <h1>{politico.nomeCivil}</h1>
      <div className="info-basica">
        <img src={politico.ultimoStatus.urlFoto} alt={politico.nomeCivil} />
        <div>
          <p><strong>Nome Parlamentar:</strong> {politico.ultimoStatus.nomeEleitoral}</p>
          <p><strong>Partido:</strong> {politico.ultimoStatus.siglaPartido}</p>
          <p><strong>Estado:</strong> {politico.ultimoStatus.siglaUf}</p>
          <p><strong>Situação:</strong> {politico.ultimoStatus.situacao}</p>
        </div>
      </div>

      <section className="vida-publica">
        <h2>Vida Pública</h2>
        <p><strong>Data de Nascimento:</strong> {new Date(politico.dataNascimento).toLocaleDateString()}</p>
        <p><strong>Escolaridade:</strong> {politico.escolaridade}</p>
        <p><strong>Município de Nascimento:</strong> {politico.municipioNascimento} - {politico.ufNascimento}</p>
      </section>

      <section className="propostas-legislativas">
        <h2>Propostas Legislativas Recentes</h2>
        {proposicoes.length > 0 ? (
          <ul>
            {proposicoes.map(prop => (
              <li key={prop.id}>
                {prop.siglaTipo} {prop.numero}/{prop.ano} - {prop.ementa.substring(0, 100)}...
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma proposta legislativa recente encontrada.</p>
        )}
      </section>

      <section className="gestao-recursos">
        <h2>Gestão de Recursos (Últimas Despesas)</h2>
        {despesas.length > 0 ? (
          <ul>
            {despesas.map((despesa, index) => (
              <li key={index}>
                {despesa.tipoDespesa}: R$ {despesa.valorDocumento.toFixed(2)} - {new Date(despesa.dataDocumento).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma despesa recente encontrada.</p>
        )}
      </section>
    </div>
  );
}