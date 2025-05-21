import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
  return (
    <main className="flex h-screen w-screen flex-col items-center">
      <Header />
      <div className="flex w-full flex-1 flex-col overflow-scroll pb-2">
        <div className="from-primary/80 to-primary relative flex h-1/6 w-full flex-col-reverse bg-gradient-to-br px-2">
          <Link href="/leaderboard" className="bg-background/30 absolute top-2 left-2 rounded-full p-2">
            <ChevronLeft />
          </Link>
          <div className="border-background h-24 w-24 translate-y-12 overflow-hidden rounded-full border-6 bg-black shadow-sm">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        </div>
        <div className="flex-1 px-4 pt-12">
          <div className="flex items-center">
            <Skeleton className="h-8 w-40 rounded-full" />
            <div className="ml-auto">
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-1 h-4 w-28 rounded-full" />
          <div className="mt-4 space-y-1">
            <Skeleton className="ml-4 h-4 w-[calc(100%_-_1rem)] rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-9/10 rounded-full" />
          </div>
          <hr className="my-4" />
          <Skeleton className="mb-3 h-6 w-24 rounded-full" />
          <div className="mt-2 grid grid-cols-1 gap-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-input/30 border-input flex w-full items-center gap-2 rounded-lg border px-4 py-2"
                >
                  <div className="h-9 w-9 overflow-hidden rounded-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
              ))}
          </div>
        </div>
      </div>
      <Navbar active="leaderboard" />
    </main>
  );
}
