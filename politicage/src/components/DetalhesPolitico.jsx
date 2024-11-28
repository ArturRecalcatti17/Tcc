import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ComentariosAvaliacoes } from './ComentariosAvaliacoes';
import '../styles/detalhesPolitico.css';


export function DetalhesPolitico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [politico, setPolitico] = useState(null);
  const [despesas, setDespesas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [ocupacoes, setOcupacoes] = useState([]); // Adicionando estado para ocupações
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
     
      try {
        const [politicoRes, despesasRes, eventosRes, ocupacoesRes] = await Promise.all([
          axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`),
          axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/despesas`),
          axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/eventos`),
          axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/ocupacoes`) // Adicionando a chamada para ocupações
        ]);
       
        localStorage.setItem('ultimoDeputadoId', id);


        setPolitico(politicoRes.data.dados);
        setDespesas(despesasRes.data.dados || []);
        setEventos(eventosRes.data.dados || []);
        setOcupacoes(ocupacoesRes.data.dados || []); // Armazenando ocupações
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados.');
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
      <section className="navbarD">
        <ul>
          <li><a href="#capitulo1">Identidade</a></li>
          <li><a href="#capitulo2">Gastos Públicos</a></li>
          <li><a href="#capitulo3">Eventos</a></li>
          <li><a href="#capitulo4">Ocupações</a></li>
          <li><a href="#capitulo5">Comentários e Avaliações</a></li> {/* Atualizando o link para Comentários e Avaliações */}
        </ul>
      </section>
      <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
      <h1 id="capitulo1">{politico.nomeCivil}</h1>
      <div className="info-basica">
        <div className="imgDep">
          <img src={politico.ultimoStatus.urlFoto} alt={politico.nomeCivil} />
        </div>
        <div className='underImg'>
          <p><strong>Nome Parlamentar: </strong> {politico.ultimoStatus.nomeEleitoral}</p>
          <p><strong>Partido: </strong> {politico.ultimoStatus.siglaPartido}</p>
          <p><strong>Estado: </strong> {politico.ultimoStatus.siglaUf}</p>
          <p><strong>Situação: </strong> {politico.ultimoStatus.situacao}</p>
          <p><strong>Data de Nascimento: </strong> {new Date(politico.dataNascimento).toLocaleDateString()}</p>
          <p><strong>Escolaridade: </strong> {politico.escolaridade}</p>
          <p><strong>Município de Nascimento: </strong> {politico.municipioNascimento} - {politico.ufNascimento}</p>
        </div>
      </div>
      <section className='Despesas' id='capitulo2'>
        <h1>Despesas</h1>
        <div className="despesas">
          {despesas.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                  <th>Fornecedor</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.dataDocumento).toLocaleDateString()}</td>
                    <td>R$ {item.valorDocumento ? item.valorDocumento.toFixed(2) : '0.00'}</td>
                    <td>{item.tipoDespesa}</td>
                    <td>{item.nomeFornecedor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma despesa encontrada.</p>
          )}
        </div>
      </section>
      <section className='Eventos' id="capitulo3">
        <h1>Eventos</h1>
        <div className="eventos">
          {eventos.length > 0 ? (
            <ul>
              {eventos.map((evento, index) => (
                <li key={index}>
                  <h3>Local: {evento.localCamara.nome}</h3>
                  <p><strong>Data Início:</strong> {new Date(evento.dataHoraInicio).toLocaleString()}</p>
                  <p><strong>Data Fim:</strong> {new Date(evento.dataHoraFim).toLocaleString()}</p>
                  <p><strong>Descrição:</strong> {evento.descricao}</p>
                  <p><strong>Descrição do Tipo:</strong> {evento.descricaoTipo}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum evento encontrado.</p>
          )}
        </div>
      </section>
      <section className='Ocupacoes' id="capitulo4">
        <h1>Ocupações</h1>
        <div className="ocupacoes">
          {ocupacoes.length > 0 ? (
            <ul>
              {ocupacoes.map((ocupacao, index) => (
                <li key={index}>
                  <h3>{ocupacao.titulo}</h3>
                  <p><strong>UF:</strong> {ocupacao.entidadeUF ? ocupacao.entidadeUF : 'vazio'}</p>
                  <p><strong>País:</strong> {ocupacao.entidadePais ? ocupacao.entidadePais : 'vazio'}</p>
                  <p><strong>Ano de Início:</strong> {ocupacao.anoInicio ? ocupacao.anoInicio : 'vazio'}</p>
                  <p><strong>Ano de Fim:</strong> {ocupacao.anoFim ? ocupacao.anoFim : 'vazio'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma ocupação encontrada.</p>
          )}
        </div>
      </section>
      <section className='ComentariosAvaliacoes' id="capitulo5">
        <h1>Comentários e Avaliações</h1>
        <ComentariosAvaliacoes idPolitico={id} />
      </section>
    </div>
  );
}
