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
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Spanish',
        imageSrc: '/es.svg'
      },
      {
        id: 2,
        title: 'Italian',
        imageSrc: '/it.svg'
      },
      {
        id: 3,
        title: 'French',
        imageSrc: '/fr.svg'
      },
      {
        id: 4,
        title: 'Coaration',
        imageSrc: '/hr.svg'
      }
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // Spanish
        title: 'Unit 1',
        description: 'Learn the basics of spanish',
        order: 1
      }
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1, // Unit 1 (Learn the basics)
        order: 1,
        title: 'Nouns'
      },
      {
        id: 2,
        unitId: 1, // Unit 1 (Learn the basics)
        order: 2,
        title: 'Verbs'
      },
      {
        id: 3,
        unitId: 1, // Unit 1 (Learn the basics)
        order: 3,
        title: 'Adjectives'
      },
      {
        id: 4,
        unitId: 1, // Unit 1 (Learn the basics)
        order: 4,
        title: 'Adjectives'
      },
      {
        id: 5,
        unitId: 1, // Unit 1 (Learn the basics)
        order: 5,
        title: 'Adjectives'
      }
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1, // Nouns
        type: 'SELECT',
        question: 'Which of these is "the man"?',
        order: 1
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1,
        imageSrc: '/man.svg',
        correct: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3'
      },
      {
        id: 2,
        challengeId: 1,
        imageSrc: '/woman.svg',
        correct: false,
        text: 'la mujhe',
        audioSrc: '/es_woman.mp3'
      },
      {
        id: 3,
        challengeId: 1,
        imageSrc: '/robot.svg',
        correct: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3'
      }
    ]);

    console.log('Seeding finished');
  } catch (err) {
    console.error(err);
    throw new Error('Failed to seed the database');
  }
})();
