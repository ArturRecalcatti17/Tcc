import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/buscaPoliticos.css';

export function BuscaPoliticos() {
  const [politicos, setPoliticos] = useState([]);
  const [filtro, setFiltro] = useState({ nome: '', partido: '', estado: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    buscarPoliticos();
  }, []);

  const buscarPoliticos = async () => {
    setLoading(true);
    try {
      let url = 'https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';
      if (filtro.nome) url += `&nome=${filtro.nome}`;
      if (filtro.partido) url += `&siglaPartido=${filtro.partido}`;
      if (filtro.estado) url += `&siglaUf=${filtro.estado}`;

      const response = await axios.get(url);
      setPoliticos(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar políticos:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarPoliticos();
  };

  return (
    <div className="busca-politicos">
      <h1>Busca de Políticos</h1>
      <form onSubmit={handleSubmit} className="busca-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome do político"
          value={filtro.nome}
          onChange={handleInputChange}
          className="input-busca"
        />
        <input
          type="text"
          name="partido"
          placeholder="Sigla do partido"
          value={filtro.partido}
          onChange={handleInputChange}
          className="input-busca"
        />
        <input
          type="text"
          name="estado"
          placeholder="Sigla do estado"
          value={filtro.estado}
          onChange={handleInputChange}
          className="input-busca"
        />
        <button type="submit" className="btn-buscar">Buscar</button>
      </form>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="lista-politicos">
          {politicos.map((politico) => (
            <li key={politico.id} className="politico-item">
              <img src={politico.urlFoto} alt={politico.nome} width="50" height="50" />
              <div>
                <h3>{politico.nome}</h3>
                <p>Partido: {politico.siglaPartido} - Estado: {politico.siglaUf}</p>
              </div>
              <Link to={`/politico/${politico.id}`} className="btn-detalhes">
                Ver Detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}