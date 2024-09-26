import { defineConfig } from "drizzle-kit";


export default defineConfig({

  dialect: "postgresql",
  schema: "./src/db/schema/schema.js",
  out: "./migrations",
  dbCredentials:{
    url: 'postgresql://pocket_owner:eQfaJOBp4Io7@ep-yellow-union-a5sj0vil.us-east-2.aws.neon.tech/pocket?sslmode=requireS'
  }
});