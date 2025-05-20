import { House, Medal } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="flex-1">I like boats</div>
      <nav className="grid h-24 w-full grid-cols-2 border-t">
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
