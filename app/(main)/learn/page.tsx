import { FeedWrapper } from '@/components/feedWrapper';
import { StickyWrapper } from '@/components/stickyWrapper';
import { Header } from './header';
import { UserProgress } from '@/components/userProgress';
import { getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';

export default async function LearnPage() {
  const [userProgress] = await Promise.all([
    getUserProgress()
  ]);
  if (!userProgress || !userProgress.activeCourseId) redirect('/courses');
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={{ title: "Spanish", imageSrc: "/es.svg" }}
          hearts={5}
          points={100}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title="Spanish" />
      </FeedWrapper>
    </div>
  );
}
