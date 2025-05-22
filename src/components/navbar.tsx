'use client';

import { useUser } from '@clerk/nextjs';
import { House, Trophy, ShieldUser } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps {
  active: 'home' | 'leaderboard' | 'admin';
}

export function Navbar({ active }: NavbarProps) {
  const { isLoaded, user } = useUser();
  const [isAdmin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded || !user) {
      setAdmin(false);
      return;
    }
    setAdmin(user.publicMetadata.role === 'admin');
  }, [user, isLoaded]);

  return (
    <nav className={`grid h-22 w-full border-t ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
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
      {isAdmin && (
        <Link
          href="/admin"
          className={`flex h-full w-full flex-col items-center justify-center border-l ${active === 'admin' ? 'bg-input/25 text-primary' : ''}`}
        >
          <ShieldUser size={36} strokeWidth={1.5} />
          <span className="font-bold">Admin</span>
        </Link>
      )}
    </nav>
  );
}
