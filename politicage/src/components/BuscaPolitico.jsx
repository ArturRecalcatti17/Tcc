import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/buscaPoliticos.css';
import clips2 from '../assets/clips2.svg'
import local from '../assets/local.svg'
import despesas from '../assets/despesas.svg'
import doublePersons from '../assets/doublePersons.svg'
import handPart from '../assets/handPart.svg'

export function BuscaPoliticos() {
  const [politicos, setPoliticos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    buscarPoliticos();
  }, []);

  const buscarPoliticos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome');
      
      const politicosComDetalhes = await Promise.all(
        response.data.dados.map(async (politico) => {
          try {
            const detalhesResponse = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${politico.id}`);
            const dataNascimento = detalhesResponse.data.dados.dataNascimento;
            const idade = calcularIdade(dataNascimento);
            
            return { ...politico, idade };
          } catch (error) {
            console.error(`Erro ao buscar detalhes do deputado ${politico.nome}:`, error);
            return { ...politico, idade: null };
          }
        })
      );

      const resultadosFiltrados = politicosComDetalhes.filter(politico => 
        politico.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        politico.siglaPartido.toLowerCase().includes(termoBusca.toLowerCase()) ||
        politico.siglaUf.toLowerCase().includes(termoBusca.toLowerCase())
      );

      setPoliticos(resultadosFiltrados);
    } catch (error) {
      console.error('Erro ao buscar políticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesNascimento > mesAtual || 
        (mesNascimento === mesAtual && nascimento.getDate() > hoje.getDate())) {
      idade--;
    }
    
    return idade;
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
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Busque por nome, partido ou estado"
          className="input-busca"
        />
        <button type="submit" className="btn-buscar">Buscar</button>
      </form>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="listas-container">
          <ul className="lista-politicos">
            {politicos.slice(0, Math.ceil(politicos.length / 2)).map((politico) => (
              <li key={politico.id} className="politico-item">
                <div className="imgbanner">
                <img src={politico.urlFoto} alt={politico.nome} className='img' width="150" height="150"  />
                <img src={doublePersons} className='doub' alt="" />
                <img src={local} alt="" />
                <img src={handPart} className='hand' alt="" />
                <img src={despesas} alt="" />
                <img src={clips2} className='clip' alt="" />
                </div>

                <div className='itensbanner' >
                <h3>{politico.nome}</h3>
                  <p>{politico.idade} anos</p>
                  <p>{politico.siglaPartido}</p>
                  <p>{politico.siglaUf}</p>
                <Link to={`/politico/${politico.id}`} className="btn-detalhes">
                  DESPESAS
                </Link>
                <Link to={`/politico/${politico.id}`} className="btn-detalhes">
                  HISTÓRICO
                </Link>
                </div>

              </li>
            ))}
          </ul>
          <ul className="lista-politicos">
            {politicos.slice( Math.ceil(politicos.length / 2)).map((politico) => (
              <li key={politico.id} className="politico-item">
              <div className="imgbanner">
              <img src={politico.urlFoto} alt={politico.nome} className='img' width="150" height="150"  />
              <img src={doublePersons} className='doub' alt="" />
              <img src={local} alt="" />
              <img src={handPart} className='hand' alt="" />
              <img src={despesas} alt="" />
              <img src={clips2} className='clip' alt="" />
              </div>

              <div className='itensbanner' >
              <h3>{politico.nome}</h3>
                <p>{politico.idade} anos</p>
                <p>{politico.siglaPartido}</p>
                <p>{politico.siglaUf}</p>
              <Link to={`/politico/${politico.id}`} className="btn-detalhes">
                DESPESAS
              </Link>
              <Link to={`/politico/${politico.id}`} className="btn-detalhes">
                HISTÓRICO
              </Link>
              </div>

            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}