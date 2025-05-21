import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

function LeaderboardItemSkeleton({ place }: { place: number }) {
  function Icon() {
    if ([1, 2, 3].includes(place)) return <Trophy className="text-muted-foreground mr-2 h-6 w-6" />;
    return <span className="text-black-500 text-muted-foreground mr-3 text-center font-bold">{place}</span>;
  }

  return (
    <div className="bg-input border-input flex w-full items-center rounded-lg border p-4 shadow-sm">
      <div className="flex w-10 items-center justify-center">
        <Icon />
      </div>

      <div className="h-10 w-10 overflow-hidden rounded-full border shadow-sm">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="ml-2 flex-1">
        <Skeleton className="h-5 w-32" />
      </div>

      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="flex h-screen w-screen flex-col items-center">
      <Header />
      <div className="w-full flex-1 overflow-scroll p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">Leaderboard</h1>
        <div className="flex w-full flex-col gap-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <LeaderboardItemSkeleton key={i} place={i + 1} />
            ))}
        </div>
      </div>
      <Navbar active="leaderboard" />
    </main>
  );
}
