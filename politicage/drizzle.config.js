import { defineConfig } from "drizzle-kit";


export default defineConfig({

  dialect: "postgresql",
  schema: "./src/db/schema/schema.js",
  out: "./migrations",
  dbCredentials:{
    url: 'postgresql://empress_owner:x3HpFZGoIr6W@ep-old-water-a5znrwib.us-east-2.aws.neon.tech/empress?sslmode=require'
  }
});