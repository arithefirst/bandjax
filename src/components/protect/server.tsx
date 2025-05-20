'use server';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface ProtectServerProps {
  children: React.ReactNode;
}

export async function ProtectRSC({ children }: ProtectServerProps) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
