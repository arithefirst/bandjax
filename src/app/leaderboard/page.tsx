import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';

export default function Page() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Header />
      <div className="flex flex-1 items-center justify-center">I like beautiful rocks</div>
      <Navbar active="leaderboard" />
    </main>
  );
}
