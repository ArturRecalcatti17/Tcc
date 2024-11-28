import React, { useState, useEffect } from 'react';
import { db } from '../db/config';
import { comentario, avaliacao, politicosTable } from '../db/schema/schema';
import { eq, and, desc } from 'drizzle-orm';
import '../styles/comentariosAvaliacoes.css';


export function ComentariosAvaliacoes({ idPolitico }) {
  const [comentarios, setComentarios] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [novaAvaliacao, setNovaAvaliacao] = useState(0);
  const [error, setError] = useState(null);
  const [usuarioAtual] = useState(localStorage.getItem('usuarioId'));
  const [editandoComentario, setEditandoComentario] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState('');


  const carregarDados = async () => {
    if (!idPolitico) {
      setError('ID do político não fornecido');
      return;
    }


    try {
      const politico = await db
        .select({
          id: politicosTable.id,
          id_externo: politicosTable.id_externo,
          nome: politicosTable.nome
        })
        .from(politicosTable)
        .where(eq(politicosTable.id_externo, idPolitico))
        .limit(1);


      let politicoId;


      if (!politico.length) {
        const [novoPolitico] = await db
          .insert(politicosTable)
          .values({
            id_externo: idPolitico,
            nome: '',
            dataNasc: new Date(),
            uf: '',
            cidade: ''
          })
          .returning();
        politicoId = novoPolitico.id;
      } else {
        politicoId = politico[0].id;
      }


      const [comentariosData, avaliacoesData] = await Promise.all([
        db
          .select()
          .from(comentario)
          .where(eq(comentario.id_politico, politicoId))
          .orderBy(desc(comentario.data_criacao)),
        db
          .select()
          .from(avaliacao)
          .where(eq(avaliacao.id_politico, politicoId))
          .orderBy(desc(avaliacao.id_politico))
      ]);


      setComentarios(comentariosData);
      setAvaliacoes(avaliacoesData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar comentários e avaliações.');
      setComentarios([]);
      setAvaliacoes([]);
    }
  };


  useEffect(() => {
    carregarDados();
  }, [idPolitico]);


  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) {
        setError('Usuário não está logado.');
        return;
      }


      const politicoExiste = await db
        .select()
        .from(politicosTable)
        .where(eq(politicosTable.id_externo, idPolitico))
        .limit(1);


      if (!politicoExiste.length) {
        setError('Político não encontrado.');
        return;
      }


      const politicoId = politicoExiste[0].id;


      await db.insert(comentario).values({
        id_politico: politicoId,
        id_usuario: usuarioId,
        comentario: novoComentario,
        data_criacao: new Date(),
        data_alteracao: new Date()
      }).returning();


      setNovoComentario('');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      setError('Erro ao adicionar comentário.');
    }
  };


  const handleAvaliacaoSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) {
        setError('Usuário não está logado.');
        return;
      }


      const politicoExiste = await db
        .select()
        .from(politicosTable)
        .where(eq(politicosTable.id_externo, idPolitico))
        .limit(1);


      if (!politicoExiste.length) {
        setError('Político não encontrado.');
        return;
      }


      const politicoId = politicoExiste[0].id;


      await db.insert(avaliacao).values({
        id_politico: politicoId,
        id_usuario: usuarioId,
        avaliacao: novaAvaliacao
      }).returning();


      setNovaAvaliacao(0);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      setError('Erro ao adicionar avaliação.');
    }
  };


  return (
    <div>
      {error && <div className="error-message">{error}</div>}
     
      <div className="form-section">
        <form onSubmit={handleComentarioSubmit}>
          <textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Deixe seu comentário..."
            required
          />
          <button type="submit">Comentar</button>
        </form>


        <form onSubmit={handleAvaliacaoSubmit}>
          <select
            value={novaAvaliacao}
            onChange={(e) => setNovaAvaliacao(Number(e.target.value))}
            required
          >
            <option value="0">Selecione uma nota</option>
            <option value="1">1 - Muito Ruim</option>
            <option value="2">2 - Ruim</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bom</option>
            <option value="5">5 - Muito Bom</option>
          </select>
          <button type="submit">Avaliar</button>
        </form>
      </div>


      <div className="content-section">
        <div className="comentarios-list">
          <h3>Comentários</h3>
          {comentarios.length > 0 ? (
            <ul>
              {comentarios.map((com) => (
                <li key={com.id} className="comentario-item">
                  <div className="comentario-content">
                    <p>{com.comentario}</p>
                    <small>Data: {new Date(com.data_criacao).toLocaleDateString()}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum comentário ainda.</p>
          )}
        </div>


        <div className="avaliacoes-list">
          <h3>Avaliações</h3>
          {avaliacoes.length > 0 ? (
            <ul>
              {avaliacoes.map((aval) => (
                <li key={aval.id}>
                  <div className="avaliacao-content">
                    <p>Nota: {aval.avaliacao}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma avaliação ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
