import { cache } from 'react';
import db from './drizzle';
import { auth } from '@clerk/nextjs/server';
import { challengeProgress, courses, lessons, units, userProgress } from './schema';
import { eq } from 'drizzle-orm';

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getUserProgress = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;
  const data = await db.query.userProgress.findFirst(
    { where: eq(userProgress.userId, userId) },
  );
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  // Todo: Populate units and lessons
  return await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
});

export const getCourseProgress = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();
  if (!userProgress || !userProgress.activeCourseId || !userId) return null;
  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  });
  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap(unit => unit.lessons)
    .find(lesson => {
      return lesson.challenges.some(
        challenge => !challenge.challengeProgress || 
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(progress => !progress.completed)
      )
    });
  return {
    activeLesson: firstUncompletedLesson,
    aciveLessonId: firstUncompletedLesson?.id
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = auth();
  const courseProgress = await getCourseProgress();
  const lessonId = id || courseProgress?.aciveLessonId;
  if (!lessonId || !userId) return null;
  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId)
          }
        }
      }
    }
  });
  if (!data || !data.challenges) return null;
  const normalizedChallenges = data.challenges.map(challenge => {
    const completed = challenge.challengeProgress && 
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every(progress => progress.completed)
    return { ...challenge, completed };
  });
  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async (): Promise<number> => {
  const courseProgress = await getCourseProgress();
  if (!courseProgress || !courseProgress.aciveLessonId) return 0;
  const lesson = await getLesson(courseProgress.aciveLessonId);
  if (!lesson) return 0;
  const completedChallenges = lesson.challenges.filter(challenge => challenge.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );
  return percentage;
});

export const getUnits = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();
  if (!userProgress || !userProgress.activeCourseId || !userId) return [];
  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  });
  const normalizeData = data.map(unit => {
    const lessonsWithCompletedStatus = unit.lessons.map(lesson => {
      if (lesson.challenges.length === 0) return { ...lesson, completed: false };
      const allCompletedChallenges = lesson.challenges.every(
        challege => {
          return challege.challengeProgress &&
            challege.challengeProgress.length > 0 &&
            challege.challengeProgress.every(progress => progress.completed)
        }
      );
      return { ...lesson, completed: allCompletedChallenges };
    });
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });
  return normalizeData;
});
