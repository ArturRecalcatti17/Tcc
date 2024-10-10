import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon('postgresql://empress_owner:x3HpFZGoIr6W@ep-old-water-a5znrwib.us-east-2.aws.neon.tech/empress?sslmode=require')
export const db = drizzle(sql)