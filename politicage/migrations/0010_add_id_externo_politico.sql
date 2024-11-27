ALTER TABLE "politico" ADD COLUMN IF NOT EXISTS "id_externo" text;
UPDATE "politico" SET "id_externo" = id::text WHERE "id_externo" IS NULL;
ALTER TABLE "politico" ALTER COLUMN "id_externo" SET NOT NULL;
ALTER TABLE "politico" ADD CONSTRAINT "politico_id_externo_unique" UNIQUE ("id_externo");