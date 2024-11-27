ALTER TABLE "politico" ADD COLUMN "id_externo" text NOT NULL;--> statement-breakpoint
ALTER TABLE "politico" ADD CONSTRAINT "politico_id_externo_unique" UNIQUE("id_externo");