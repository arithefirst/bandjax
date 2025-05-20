'use client';

import { Ribbon } from '@/components/ribbon';
import { Header } from '@/components/header';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';

export default function Home() {
  const [medal, setMedal] = useState<number>(0);

  const medalColors: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold'];

  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Header />
      <div
        className="flex flex-1 items-center justify-center"
        onClick={() => setMedal((c) => (c === 2 ? 0 : c + 1))}
      >
        <Ribbon color={medalColors[medal]} className="scale-75" />
      </div>
      <Navbar active="home" />
    </main>
  );
}
