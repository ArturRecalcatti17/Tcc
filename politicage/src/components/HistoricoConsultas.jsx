import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function HistoricoConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultas = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3333/api/consultas');
        setConsultas(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar consultas:', err);
        setError('Não foi possível carregar o histórico de consultas.');
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  const adicionarConsulta = async (novaConsulta) => {
    try {
      const response = await axios.post('http://localhost:3333/api/consultas', novaConsulta);
      setConsultas([...consultas, response.data]);
    } catch (err) {
      console.error('Erro ao adicionar consulta:', err);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="historico-consultas">
      <h1>Histórico de Consultas</h1>
      {consultas.length === 0 ? (
        <p>Nenhuma consulta realizada ainda.</p>
      ) : (
        <ul className="lista-consultas">
          {consultas.map((consulta) => (
            <li key={consulta.id} className="item-consulta">
              <div className="info-consulta">
                <h3>{consulta.tipo}</h3>
                <p>Data: {new Date(consulta.data).toLocaleString()}</p>
                <p>Termo pesquisado: {consulta.termo}</p>
              </div>
              <Link to={`/consulta/${consulta.id}`} className="btn-detalhes">
                Ver Detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/dashboard')} className="btn-voltar">Voltar ao Dashboard</button>
    </div>
  );
}