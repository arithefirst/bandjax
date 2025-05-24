'use server';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function ProtectRSC({
  children,
  forAdmin = false,
  checkOnboarded = false,
}: {
  children: React.ReactNode;
  forAdmin?: boolean;
  checkOnboarded?: boolean;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (checkOnboarded && user.publicMetadata.onboarded !== true) {
    redirect('/onboarding');
  }

  if (forAdmin && user.publicMetadata.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
