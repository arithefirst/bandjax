import { House, Medal } from 'lucide-react';
import { Ribbon } from '@/components/ribbon';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <Ribbon color="silver" className="scale-75" />
      </div>
      <nav className="grid h-22 w-full grid-cols-2 border-t">
        {/* Remember to make these do things later :D */}
        <div className="flex h-full w-full flex-col items-center justify-center border-r">
          <House size={36} strokeWidth={1.5} />
          <span className="font-bold">Home</span>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Medal size={36} strokeWidth={1.5} />
          <span className="font-bold">Leaderboard</span>
        </div>
      </nav>
    </main>
  );
}
