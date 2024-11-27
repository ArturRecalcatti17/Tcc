import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db } from '../db/config';
import { politicosTable, consultasHistorico } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import '../styles/detalhesPolitico.css';
import { ComentariosAvaliacoes } from './ComentariosAvaliacoes';
import { fetchDeputado, fetchDadosComplementares } from '../utils/api';

export function DetalhesPolitico() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para dados básicos
  const [politico, setPolitico] = useState(null);
  const [politicoUUID, setPoliticoUUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para informações adicionais
  const [proposicoes, setProposicoes] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [frequencia, setFrequencia] = useState([]);
  const [votacoes, setVotacoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      try {
        const dadosPolitico = await fetchDeputado(id);
        if (!dadosPolitico) {
          setError('Político não encontrado');
          return;
        }

        setPolitico(dadosPolitico);
        
        const dadosComplementares = await fetchDadosComplementares(id);
        setComissoes(dadosComplementares?.comissoes || []);
        setFrequencia(dadosComplementares?.eventos || []);
        setVotacoes(dadosComplementares?.discursos || []);
        setProposicoes(dadosComplementares?.proposicoes || []);
        setDespesas(dadosComplementares?.despesas || []);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados do político');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderInfoBasica = () => {
    if (!politico) return null;

    const ultimoStatus = politico.ultimoStatus || {};
    const nomeCivil = politico.nomeCivil || 'Não informado';
    const nomeEleitoral = ultimoStatus.nomeEleitoral || 'Não informado';
    const siglaPartido = ultimoStatus.siglaPartido || 'Não informado';
    const siglaUf = ultimoStatus.siglaUf || 'Não informado';

    return (
      <div className="info-basica">
        <img
          src={ultimoStatus.urlFoto || ''}
          alt={`Foto de ${nomeCivil}`}
          className="foto-politico"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
        <div className="info-container">
          <p><strong>Nome Civil:</strong> {nomeCivil}</p>
          <p><strong>Nome Parlamentar:</strong> {nomeEleitoral}</p>
          <p><strong>Partido:</strong> {siglaPartido}</p>
          <p><strong>Estado:</strong> {siglaUf}</p>
        </div>
      </div>
    );
  };

  const renderDespesas = () => {
    if (!despesas?.length) return <p>Nenhuma despesa encontrada</p>;

    return (
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Fornecedor</th>
          </tr>
        </thead>
        <tbody>
          {despesas.slice(0, 10).map((despesa, index) => {
            const dataDocumento = despesa.dataDocumento ? new Date(despesa.dataDocumento) : null;
            return (
              <tr key={index}>
                <td>{despesa.tipoDespesa || 'N/A'}</td>
                <td>R$ {(despesa.valorDocumento || 0).toFixed(2)}</td>
                <td>{dataDocumento ? dataDocumento.toLocaleDateString() : 'N/A'}</td>
                <td>{despesa.nomeFornecedor || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="detalhes-politico">
      <button onClick={() => navigate(-1)} className="btn-voltar">
        Voltar
      </button>

      {/* 1. Identidade e Representação */}
      <section className="identidade-representacao">
        <h2>Identidade e Representação</h2>
        {renderInfoBasica()}
      </section>

      {/* 2. Atuação Legislativa */}
      <section className="atuacao-legislativa">
        <h2>Atuação Legislativa</h2>
        <div className="proposicoes">
          <h3>Proposições Recentes</h3>
          {proposicoes.length > 0 ? (
            <ul>
              {proposicoes.slice(0, 5).map((prop, index) => (
                <li key={`prop-${prop.id || index}`}>
                  <strong>{prop.siglaTipo} {prop.numero}/{prop.ano}</strong>
                  <p>{prop.ementa?.substring(0, 200)}...</p>
                  <span className="status">Status: {prop.statusProposicao?.descricaoSituacao}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma proposição encontrada</p>
          )}
        </div>

        <div className="comissoes">
          <h3>Comissões</h3>
          {comissoes.length > 0 ? (
            <ul>
              {comissoes.map((com, index) => (
                <li key={`com-${com.id || index}`}>
                  <p><strong>{com.sigla}</strong> - {com.nome}</p>
                  <p>Cargo: {com.titulo}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma comissão encontrada</p>
          )}
        </div>
      </section>

      {/* 3. Gastos Públicos */}
      <section className="gastos-publicos">
        <h2>Gastos Públicos</h2>
        {renderDespesas()}
      </section>

      {/* 4. Presença e Votações */}
      <section className="presenca-votacoes">
        <h2>Presença e Votações</h2>
        <div className="grid-container">
          <div className="frequencia">
            <h3>Frequência nas Sessões</h3>
            <ul>
              {frequencia.slice(0, 5).map((freq, index) => (
                <li key={`freq-${freq.data || ''}-${index}`}>
                  <p>Data: {freq.data ? new Date(freq.data).toLocaleDateString() : 'Data não disponível'}</p>
                  <p>Frequência: {freq.frequencia || 'Não informada'}</p>
                  {freq.justificativa && <p>Justificativa: {freq.justificativa}</p>}
                </li>
              ))}
            </ul>
          </div>

          <div className="votacoes">
            <h3>Últimas Votações</h3>
            <ul>
              {votacoes.slice(0, 5).map((vot, index) => (
                <li key={`vot-${vot.data || ''}-${index}`}>
                  <p><strong>{vot.proposicao?.siglaTipo || ''} {vot.proposicao?.numero || ''}</strong></p>
                  <p>Voto: {vot.voto || 'Não informado'}</p>
                  <p>Data: {vot.data ? new Date(vot.data).toLocaleDateString() : 'Data não disponível'}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Comentários e Avaliações */}
      <section className="comentarios-avaliacoes">
        <h2>Comentários e Avaliações</h2>
        <ComentariosAvaliacoes idPolitico={id} />
      </section>
    </div>
  );
}