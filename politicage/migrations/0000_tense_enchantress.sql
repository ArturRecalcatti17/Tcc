DO $$ BEGIN
 CREATE TYPE "public"."estados_brasil" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consulta_despesas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ano" integer NOT NULL,
	"mes" integer NOT NULL,
	"valor_liquido" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consultas_historico" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"condicao_eleitoral" text NOT NULL,
	"descricao_status" text NOT NULL,
	"sigla_partido" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "informacoes_dos_politicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partido" text NOT NULL,
	"sexo" text NOT NULL,
	"id_historico" uuid NOT NULL,
	"id_despesas" uuid NOT NULL,
	"id_politicos" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "politico" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text,
	"data_nasc" date NOT NULL,
	"uf" "estados_brasil" NOT NULL,
	"cidade" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text,
	"data_nasc" date NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"uf" "estados_brasil" NOT NULL,
	"cidade" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "informacoes_dos_politicos" ADD CONSTRAINT "informacoes_dos_politicos_id_historico_consultas_historico_id_fk" FOREIGN KEY ("id_historico") REFERENCES "public"."consultas_historico"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "informacoes_dos_politicos" ADD CONSTRAINT "informacoes_dos_politicos_id_despesas_consulta_despesas_id_fk" FOREIGN KEY ("id_despesas") REFERENCES "public"."consulta_despesas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "informacoes_dos_politicos" ADD CONSTRAINT "informacoes_dos_politicos_id_politicos_politico_id_fk" FOREIGN KEY ("id_politicos") REFERENCES "public"."politico"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
