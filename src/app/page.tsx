import { Header } from '@/components/header';
import { LogExerciseForm } from '@/components/logExerciseForm';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { Ribbon } from '@/components/ribbon';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { isScoreAveragingEnabled } from './actions';

export default async function Home() {
  const authData = await auth();
  const sectionData = await db.select().from(sections).orderBy(desc(sections.score));
  const userSection = sectionData.find((s) => s.members.includes(authData.userId!));
  const scoreAveraging = await isScoreAveragingEnabled();
  const rank = sectionData.findIndex((s) => s.slug === userSection?.slug) + 1;

  function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function getMedalColor(): 'bronze' | 'silver' | 'gold' {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    return 'bronze';
  }

  return (
    <ProtectRSC blockSpectators="/leaderboard">
      <main className="flex min-h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center text-xl">
          <p>
            <Link href={`/section/${userSection?.slug}`} className="font-bold">
              The {userSection?.displayName}
            </Link>{' '}
            are in
          </p>
          {[1, 2, 3].includes(rank) ? (
            <Ribbon color={getMedalColor()} className="scale-80" />
          ) : (
            <h1 className="text-primary text-8xl font-bold">{getOrdinalSuffix(rank)}</h1>
          )}
          <p>
            place with{' '}
            <span className="font-bold">
              {userSection && (scoreAveraging ? userSection.averageScore : userSection.score).toLocaleString()}{' '}
              points
            </span>
          </p>
        </div>
        <LogExerciseForm section={userSection} />
        <Navbar active="home" />
      </main>
    </ProtectRSC>
  );
}
