import { Header } from '@/components/header';
import { LeaderboardItem } from '@/components/lboardItem';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function Page() {
  const sectionData = await db.select().from(sections).orderBy(desc(sections.score));

  return (
    <ProtectRSC>
      <main className="flex h-screen w-screen flex-col items-center">
        <Header />
        <div className="w-full flex-1 overflow-scroll p-4">
          <h1 className="mb-4 text-center text-2xl font-bold">Leaderboard</h1>
          <div className="flex w-full flex-col gap-2">
            {sectionData.map(({ slug, displayName, imageUrl, score }, i) => (
              <LeaderboardItem
                score={score}
                image={imageUrl}
                name={displayName}
                key={`lbi-${slug}`}
                place={i + 1}
              />
            ))}
          </div>
        </div>
        <Navbar active="leaderboard" />
      </main>
    </ProtectRSC>
  );
}
