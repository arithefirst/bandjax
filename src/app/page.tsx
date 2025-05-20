import { House, Medal } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="flex-1">I like boats</div>
      <nav className="grid h-24 grid-cols-2 border-t w-full">
        <div className="h-full w-full flex items-center border-r justify-center flex-col">
          <House size={36} strokeWidth={1.5} />
          <span className='font-bold'>Home</span>
        </div>
        <div className="h-full w-full flex items-center justify-center flex-col">
          <Medal size={36} strokeWidth={1.5} />
          <span className='font-bold'>Leaderboard</span>
        </div>
      </nav>
    </main>
  );
}
