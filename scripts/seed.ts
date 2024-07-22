import 'dotenv/config';
import * as schema from '../db/schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const conn = neon(process.env.DATABASE_URL!);
const db = drizzle(conn, { schema });

(async () => {
  try {
    console.log('Seeding database');

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    await db.insert(schema.courses).values([
      {
        title: 'Spanish',
        imageSrc: '/es.svg'
      },
      {
        title: 'Italian',
        imageSrc: '/it.svg'
      },
      {
        title: 'French',
        imageSrc: '/fr.svg'
      },
      {
        title: 'Coaration',
        imageSrc: '/hr.svg'
      }
    ]);

    console.log('Seeding finished');
  } catch (err) {
    console.error(err);
    throw new Error('Failed to seed the database');
  }
})();
