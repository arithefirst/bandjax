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
  const [isSpectator, setSpectator] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded || !user) {
      setAdmin(false);
      setSpectator(false);
      return;
    }
    setAdmin(user.publicMetadata.role === 'admin');
    setSpectator(user.publicMetadata.isSpectator === true);
  }, [user, isLoaded]);

  // Don't show navbar for non-admin spectators
  if (isSpectator && !isAdmin) {
    return null;
  }

  // Show only leaderboard and admin for admin spectators
  const showHome = !isSpectator;
  const gridCols = showHome && isAdmin ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <nav className={`grid h-22 w-full border-t ${gridCols}`}>
      {showHome && (
        <Link
          href="/"
          className={`flex h-full w-full flex-col items-center justify-center border-r ${active === 'home' ? 'bg-input/25 text-primary' : ''}`}
        >
          <House size={36} strokeWidth={1.5} />
          <span className="font-bold">Home</span>
        </Link>
      )}
      <Link
        href="/leaderboard"
        className={`flex h-full w-full flex-col items-center justify-center ${active === 'leaderboard' ? 'bg-input/25 text-primary' : ''} ${!showHome && isAdmin ? 'border-r' : ''}`}
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
