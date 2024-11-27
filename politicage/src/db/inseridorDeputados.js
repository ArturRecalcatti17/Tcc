import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { politicosTable, infoPoliticos, consultasHistorico, consultaDespesas } from './schema/schema.js';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function inserirDeputados() {
  try {
    const response = await fetch('https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome');
    const data = await response.json();
    
    // Limita a 10 deputados
    const deputados = data.dados.slice(0, 10);

    for (const deputado of deputados) {
      // 1. Inserir dados básicos do político
      const [politico] = await db.insert(politicosTable).values({
        id_externo: deputado.id.toString(),
        nome: deputado.nome,
        dataNasc: new Date(deputado.dataNascimento),
        uf: deputado.siglaUf,
        cidade: deputado.municipioNascimento
      }).returning();


      // 2. Inserir histórico
      const [historico] = await db.insert(consultasHistorico).values({
        condicaoEleitoral: deputado.condicaoEleitoral || 'Exercício',
        descricaoStatus: deputado.situacao || 'Ativo',
        siglaPartido: deputado.siglaPartido,
        idPolitico: politico.id
      }).returning();
    }
  } catch (error) {
    console.error('Erro ao inserir deputados:', error);
  }
}

inserirDeputados();
