import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function MonitorarPolitico() {
  const [id, setId] = useState('');
  const [politico, setPolitico] = useState(null);
  const [proposicoes, setProposicoes] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [historicoAtividades, setHistoricoAtividades] = useState([]);
  const [desempenho, setDesempenho] = useState({ projetosApresentados: 0, projetosAprovados: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      setLoading(true);
      setError(null);

      try {
        const politicoRes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`);
        setPolitico(politicoRes.data.dados);

        const proposicoesRes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/proposicoes?ordem=ASC&ordenarPor=id`);
        setProposicoes(proposicoesRes.data.dados.slice(0, 5));

        const ultimasNotificacoes = proposicoesRes.data.dados.slice(0, 3).map(prop => (
          `Novo projeto de lei: ${prop.ementa.substring(0, 50)}...`
        ));
        setNotificacoes(ultimasNotificacoes);

        const atividades = proposicoesRes.data.dados.map(prop => ({
          tipo: prop.siglaTipo,
          numero: prop.numero,
          ano: prop.ano,
          ementa: prop.ementa,
        }));
        setHistoricoAtividades(atividades);

        const projetosApresentados = proposicoesRes.data.dados.length;
        const projetosAprovados = proposicoesRes.data.dados.filter(prop => prop.status === 'Aprovado').length;
        setDesempenho({ projetosApresentados, projetosAprovados });
      } catch (error) {
        console.error('Erro ao buscar dados do político:', error.response ? error.response.data : error.message);
        setError('Não foi possível carregar os dados do político.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleComentarioSubmit = (e) => {
    e.preventDefault();
    if (comentario) {
      setComentarios([...comentarios, comentario]);
      setComentario('');
    }
  };

  const handleFavoritar = () => {
    if (politico) {
      const isFavorited = favoritos.some(fav => fav.id === politico.id);
      if (!isFavorited) {
        setFavoritos([...favoritos, politico]);
        alert(`${politico.nomeCivil} foi adicionado aos favoritos!`);
      } else {
        alert(`${politico.nomeCivil} já está nos favoritos.`);
      }
    }
  };

  return (
    <div className="monitorar-politico">
      <h1>Monitorar Político</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o ID do político"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <div>Carregando...</div>}
      {error && <div>{error}</div>}
      {politico && (
        <div>
          <h2>Monitorar Político: {politico.nomeCivil}</h2>
          <div className="info-basica">
            <img src={politico.ultimoStatus.urlFoto} alt={politico.nomeCivil} />
            <p><strong>Partido:</strong> {politico.ultimoStatus.siglaPartido}</p>
            <p><strong>Estado:</strong> {politico.ultimoStatus.siglaUf}</p>
          </div>

          <button onClick={handleFavoritar}>Favoritar</button>

          <section className="redes-sociais">
            <h2>Redes Sociais</h2>
            <ul>
              {politico.redesSociais && politico.redesSociais.map((rede, index) => (
                <li key={index}>
                  <a href={rede.url} target="_blank" rel="noopener noreferrer">
                    {rede.tipo} 
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="notificacoes">
            <h2>Notificações Recentes</h2>
            <ul>
              {notificacoes.length > 0 ? (
                notificacoes.map((notificacao, index) => (
                  <li key={index}>{notificacao}</li>
                ))
              ) : (
                <p>Nenhuma notificação recente.</p>
              )}
            </ul>
          </section>

          <section className="historico-atividades">
            <h2>Histórico de Atividades</h2>
            {historicoAtividades.length > 0 ? (
              <ul>
                {historicoAtividades.map((atividade, index) => (
                  <li key={index}>
                    {atividade.tipo} {atividade.numero}/{atividade.ano} - {atividade.ementa.substring(0, 100)}...
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma atividade recente encontrada.</p>
            )}
          </section>

          <section className="desempenho">
            <h2>Análise de Desempenho</h2>
            <p><strong>Projetos Apresentados:</strong> {desempenho.projetosApresentados}</p>
            <p><strong>Projetos Aprovados:</strong> {desempenho.projetosAprovados}</p>
          </section>

          <section className="comentarios">
            <h2>Comentários</h2>
            <form onSubmit={handleComentarioSubmit}>
              <textarea
                placeholder="Deixe seu comentário..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
              <button type="submit">Comentar</button>
            </form>
            <ul>
              {comentarios.length > 0 ? (
                comentarios.map((com, index) => (
                  <li key={index}>{com}</li>
                ))
              ) : (
                <p>Nenhum comentário ainda.</p>
              )}
            </ul>
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
        </div>
      )}
    </div>
  );
}