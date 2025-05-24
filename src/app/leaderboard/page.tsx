import { Header } from '@/components/header';
import { LeaderboardItem } from '@/components/lboardItem';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { cn } from '@/lib/utils';
import { desc } from 'drizzle-orm';
import { Info } from 'lucide-react';
import { isScoreAveragingEnabled } from '../actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bandjax | Leaderboard',
};

export default async function Page() {
  const scoreAveraging = await isScoreAveragingEnabled();
  const sectionData = await db
    .select()
    .from(sections)
    .orderBy(desc(scoreAveraging ? sections.averageScore : sections.score));

  return (
    <ProtectRSC checkOnboarded>
      <main className="flex h-screen w-screen flex-col items-center">
        <Header />
        <div className="relative w-full flex-1 overflow-y-scroll p-4">
          <h1 className="mb-4 text-center text-2xl font-bold">Leaderboard</h1>
          <div className="flex w-full flex-col gap-2">
            {sectionData.map(({ slug, displayName, imageUrl, score, averageScore }, i) => (
              <LeaderboardItem
                score={scoreAveraging ? averageScore : score}
                image={imageUrl}
                name={displayName}
                key={`lbi-${slug}`}
                sectionSlug={slug}
                place={i + 1}
              />
            ))}
          </div>

          <Drawer>
            <DrawerTrigger>
              <Info className="absolute top-5.5 right-4 cursor-pointer"></Info>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">Our Scoring System</DrawerTitle>
              </DrawerHeader>

              <article className="space-y-4 p-4">
                <div>
                  <h2 className="mb-2 text-lg font-bold">How Points Are Earned</h2>
                  <p className="indent-4 text-sm leading-relaxed">
                    Each section completes exercises that have been assigned to them. Every exercise has a specific
                    point value that determines how many points you earn per minute or per repetition, depending on
                    the exercise type.
                  </p>
                </div>

                <div>
                  <h2 className="mb-2 text-lg font-bold">Scoring Modes</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h3 className="font-semibold">Total Score Mode:</h3>
                      <p className="indent-4 leading-relaxed">
                        Your section&apos;s score is the sum of all members&apos; points. Larger sections may have
                        an advantage.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Average Score Mode:</h3>
                      <p className="indent-4 leading-relaxed">
                        Your section&apos;s score is the average of all members&apos; points (total points ÷ number
                        of members). This ensures fair competition regardless of section size.
                      </p>
                    </div>

                    <div className="bg-muted mt-4 rounded-lg p-3">
                      <p className="text-sm font-medium">
                        Currently active:{' '}
                        <span className="text-primary font-bold">
                          {scoreAveraging ? 'Average Score Mode' : 'Total Score Mode'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <DrawerFooter>
                <DrawerClose className={cn('mb-2 w-full cursor-pointer', buttonVariants({ variant: 'outline' }))}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <Navbar active="leaderboard" />
      </main>
    </ProtectRSC>
  );
}
