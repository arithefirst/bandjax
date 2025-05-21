import { House, Trophy } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  active: 'home' | 'leaderboard';
}

export function Navbar({ active }: NavbarProps) {
  return (
    <nav className="grid h-22 w-full grid-cols-2 border-t">
      <Link
        href="/"
        className={`flex h-full w-full flex-col items-center justify-center border-r ${active === 'home' ? 'bg-input/25 text-primary' : ''}`}
      >
        <House size={36} strokeWidth={1.5} />
        <span className="font-bold">Home</span>
      </Link>
      <Link
        href="/leaderboard"
        className={`flex h-full w-full flex-col items-center justify-center ${active === 'leaderboard' ? 'bg-input/25 text-primary' : ''}`}
      >
        <Trophy size={36} strokeWidth={1.5} />
        <span className="font-bold">Leaderboard</span>
      </Link>
    </nav>
  );
}
