import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const conn = neon(process.env.DATABASE_URL!);
const db = drizzle(conn, { schema });

export default db;
