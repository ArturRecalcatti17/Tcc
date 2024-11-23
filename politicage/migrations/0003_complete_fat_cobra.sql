CREATE TABLE IF NOT EXISTS "avaliacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"id_politico" uuid NOT NULL,
	"avaliacao" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comentario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_politico" uuid NOT NULL,
	"id_usuario" uuid NOT NULL,
	"comentario" text NOT NULL,
	"data_criacao" date NOT NULL,
	"data_alteracao" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_usuario_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_politico_politico_id_fk" FOREIGN KEY ("id_politico") REFERENCES "public"."politico"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_politico_politico_id_fk" FOREIGN KEY ("id_politico") REFERENCES "public"."politico"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN		
 ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_usuario_usuario_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
