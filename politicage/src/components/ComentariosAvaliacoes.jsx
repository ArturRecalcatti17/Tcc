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
      // Buscar político existente
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
        // Criar novo político se não existir
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

      // Buscar comentários e avaliações
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
          .orderBy(desc(avaliacao.data_criacao))
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

      const avaliacaoExistente = await db
        .select()
        .from(avaliacao)
        .where(
          and(
            eq(avaliacao.id_politico, politicoId),
            eq(avaliacao.id_usuario, usuarioId)
          )
        );

      if (avaliacaoExistente.length > 0) {
        await db
          .update(avaliacao)
          .set({ avaliacao: Number(novaAvaliacao) })
          .where(
            and(
              eq(avaliacao.id_politico, politicoId),
              eq(avaliacao.id_usuario, usuarioId)
            )
          )
          .returning();
      } else {
        await db.insert(avaliacao).values({
          id_politico: politicoId,
          id_usuario: usuarioId,
          avaliacao: Number(novaAvaliacao),
          data_criacao: new Date()
        }).returning();
      }

      setNovaAvaliacao(0);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      setError('Erro ao adicionar avaliação.');
    }
  };

  const handleDeleteComentario = async (comentarioId) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    try {
      await db.delete(comentario)
        .where(
          and(
            eq(comentario.id, comentarioId),
            eq(comentario.id_usuario, usuarioAtual)
          )
        );
      await carregarDados();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      setError('Erro ao deletar comentário.');
    }
  };

  const handleDeleteAvaliacao = async (avaliacaoId) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      await db.delete(avaliacao)
        .where(
          and(
            eq(avaliacao.id, avaliacaoId),
            eq(avaliacao.id_usuario, usuarioAtual)
          )
        );
      await carregarDados();
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      setError('Erro ao deletar avaliação.');
    }
  };

  const handleEditarComentario = (comentario) => {
    setEditandoComentario(comentario.id);
    setComentarioEditado(comentario.comentario);
  };
  
  const handleSalvarEdicao = async () => {
    try {
      await db.update(comentario)
        .set({ 
          comentario: comentarioEditado,
          data_alteracao: new Date()
        })
        .where(
          and(
            eq(comentario.id, editandoComentario),
            eq(comentario.id_usuario, usuarioAtual)
          )
        )
        .returning();
      
      setEditandoComentario(null);
      setComentarioEditado('');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      setError('Erro ao editar comentário.');
    }
  };
  
  const handleCancelarEdicao = () => {
    setEditandoComentario(null);
    setComentarioEditado('');
  };

  return (
    <div className="comentarios-container">
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
                    {editandoComentario === com.id ? (
                      <div className="edit-form">
                        <textarea
                          value={comentarioEditado}
                          onChange={(e) => setComentarioEditado(e.target.value)}
                          className="edit-textarea"
                        />
                        <div className="edit-buttons">
                          <button 
                            onClick={() => handleSalvarEdicao()}
                            className="btn-save"
                          >
                            Salvar
                          </button>
                          <button 
                            onClick={handleCancelarEdicao}
                            className="btn-cancel"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{com.comentario}</p>
                        <small>Data: {new Date(com.data_criacao).toLocaleDateString()}</small>
                        {com.data_alteracao && com.data_alteracao !== com.data_criacao && (
                          <small> (Editado em {new Date(com.data_alteracao).toLocaleDateString()})</small>
                        )}
                      </>
                    )}
                  </div>
                  {usuarioAtual === com.id_usuario && !editandoComentario && (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEditarComentario(com)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteComentario(com.id)}
                        className="btn-delete"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
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
                  {usuarioAtual === aval.id_usuario && (
                    <button 
                      onClick={() => handleDeleteAvaliacao(aval.id)}
                      className="btn-delete"
                    >
                      Excluir
                    </button>
                  )}
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