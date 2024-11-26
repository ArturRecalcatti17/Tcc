import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function ComentariosAvaliacoes({ idPolitico }) {
  const [comentarios, setComentarios] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [novaAvaliacao, setNovaAvaliacao] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`/api/comentarios/${idPolitico}`);
        setComentarios(response.data);
      } catch (error) {
        setError('Erro ao carregar comentários.');
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await axios.get(`/api/avaliacoes/${idPolitico}`);
        setAvaliacoes(response.data);
      } catch (error) {
        setError('Erro ao carregar avaliações.');
      }
    };

    fetchComentarios();
    fetchAvaliacoes();
  }, [idPolitico]);

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/comentarios`, { idPolitico, comentario: novoComentario });
      setNovoComentario('');
    } catch (error) {
      setError('Erro ao adicionar comentário.');
    }
  };

  const handleAvaliacaoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/avaliacoes`, { idPolitico, avaliacao: novaAvaliacao });
      setNovaAvaliacao(0);
    } catch (error) {
      setError('Erro ao adicionar avaliação.');
    }
  };

  return (
    <div>
      <h2>Comentários e Avaliações</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleComentarioSubmit}>
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Deixe seu comentário..."
        />
        <button type="submit">Comentar</button>
      </form>
      <form onSubmit={handleAvaliacaoSubmit}>
        <select value={novaAvaliacao} onChange={(e) => setNovaAvaliacao(e.target.value)}>
          <option value="0">Avalie de 1 a 5</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="submit">Avaliar</button>
      </form>
      <h3>Comentários</h3>
      <ul>
        {comentarios.map((comentario) => (
          <li key={comentario.id}>
            <p>{comentario.comentario}</p>
          </li>
        ))}
      </ul>
      <h3>Avaliações</h3>
      <ul>
        {avaliacoes.map((avaliacao) => (
          <li key={avaliacao.id}>
            <p>Avaliação: {avaliacao.avaliacao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}