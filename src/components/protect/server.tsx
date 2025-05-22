'use server';

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export async function ProtectRSC({
  children,
  forAdmin = false,
}: {
  children: React.ReactNode;
  forAdmin?: boolean;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (forAdmin && user.publicMetadata.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
