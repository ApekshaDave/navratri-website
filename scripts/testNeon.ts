import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_u1vQ4jLmWKqf@ep-sparkling-surf-azx2ibam.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

async function main() {
  console.log('Testing connection to Neon...');
  const result = await sql`SELECT 1 as connected, NOW() as current_time;`;
  console.log('QueryResult:', result);
}

main().catch(console.error);
