import axios from 'axios';

const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json'
  }
});

export const fetchDeputado = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/deputados/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do deputado');
    }
    
    const data = await response.json();
    return data.dados;
  } catch (error) {
    console.error('Erro ao buscar deputado:', error);
    return null;
  }
};

export const fetchDadosComplementares = async (id) => {
  const anoAtual = new Date().getFullYear();
  
  try {
    const endpoints = [
      `/deputados/${id}/orgaos`,
      `/deputados/${id}/eventos`,
      `/deputados/${id}/discursos`,
      `/proposicoes?idDeputadoAutor=${id}&ordem=DESC&ordenarPor=id`,
      `/deputados/${id}/despesas?ano=${anoAtual}&mes=1,2,3,4,5,6,7,8,9,10,11,12&ordem=DESC`
    ];

    const requests = endpoints.map(endpoint => 
      fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(res => res.ok ? res.json() : { dados: [] })
      .catch(() => ({ dados: [] }))
    );

    const responses = await Promise.all(requests);

    return {
      comissoes: responses[0]?.dados || [],
      eventos: responses[1]?.dados || [],
      discursos: responses[2]?.dados || [],
      proposicoes: responses[3]?.dados || [],
      despesas: responses[4]?.dados || []
    };
  } catch (error) {
    console.error('Erro ao buscar dados complementares:', error);
    return {
      comissoes: [],
      eventos: [],
      discursos: [],
      proposicoes: [],
      despesas: []
    };
  }
};