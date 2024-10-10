import { integer, text, date, pgTable, uuid, pgEnum, decimal } from "drizzle-orm/pg-core";

export const userTable = pgTable('usuario', {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  nome: text('nome', { length: 256 }),
  data_nasc: date('data_nasc', { mode: 'date' }).notNull(),
  email: text('email', {length: 256}).notNull(),
  senha: text('senha').notNull(),
  uf: text('uf').notNull(),
  cidade: text('cidade', { length: 256 })
});

export const politicosTable = pgTable('politico', {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  nome: text('nome', { length: 256 }),
  dataNasc: date('data_nasc').notNull(),
  uf: text('uf').notNull(),
  cidade: text('cidade', { length: 256 })
});

export const infoPoliticos = pgTable('informacoes_dos_politicos', {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  partido: text('partido', { length: 256 }).notNull(),
  sexo: text('sexo', { length: 1 }).notNull(),
  id_historico: uuid("id_historico").notNull().references(() => consultasHistorico.id),
  id_despesas: uuid("id_despesas").notNull().references(() => consultaDespesas.id),
  id_politicos: uuid("id_politicos").notNull().references(() => politicosTable.id)
});

export const consultasHistorico = pgTable('consultas_historico', {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  condicaoEleitoral: text('condicao_eleitoral').notNull(),
  descricaoStatus: text('descricao_status').notNull(),
  siglaPartido: text('sigla_partido', { length: 10 })
});

export const consultaDespesas = pgTable('consulta_despesas', {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  ano: integer('ano').notNull(),
  mes: integer('mes').notNull(),
  valorLiquido: decimal('valor_liquido', { precision: 10, scale: 2 }).notNull()
});
