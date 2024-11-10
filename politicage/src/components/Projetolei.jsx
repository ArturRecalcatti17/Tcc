import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export function ProjetoLei() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/proposicoes/${id}`);
        setProjeto(response.data.dados);
      } catch (error) {
        console.error('Erro ao buscar projeto de lei:', error);
        setError('Não foi possível carregar os dados do projeto de lei.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!projeto) return <div>Projeto não encontrado.</div>;

  return (
    <div>
      <h1>{projeto.ementa}</h1>
      <p><strong>Data de Apresentação:</strong> {new Date(projeto.dataApresentacao).toLocaleDateString()}</p>
      <p><strong>Autor:</strong> {projeto.autor}</p>
      {/* Adicione mais detalhes conforme necessário */}
    </div>
  );
}