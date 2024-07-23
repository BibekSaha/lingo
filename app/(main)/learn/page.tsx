import { FeedWrapper } from '@/components/feedWrapper';
import { StickyWrapper } from '@/components/stickyWrapper';
import { Header } from './header';
import { UserProgress } from '@/components/userProgress';
import { getCourseById, getUnits, getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';
import { Unit } from './unit';

export default async function LearnPage() {
  const [userProgress, units] = await Promise.all([
    getUserProgress(), getUnits()
  ]);
  if (!userProgress || !userProgress.activeCourseId) redirect('/courses');
  const [activeCourse] = await Promise.all([getCourseById(userProgress.activeCourseId)]);
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={activeCourse!}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={activeCourse?.title || ''} />
        {units.map(unit => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={null}
              activeLessonPercentage={0}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
}
