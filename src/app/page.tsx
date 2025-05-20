import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { Ribbon } from '@/components/ribbon';

export default function Home() {
  return (
    <ProtectRSC>
      <main className="flex min-h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Ribbon color="gold" className="scale-75" />
        </div>
        <Navbar active="home" />
      </main>
    </ProtectRSC>
  );
}
