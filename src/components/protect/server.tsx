import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function ProtectRSC({
  children,
  forAdmin = false,
  checkOnboarded = false,
  blockSpectators = null,
}: {
  children: React.ReactNode;
  forAdmin?: boolean;
  checkOnboarded?: boolean;
  blockSpectators?: null | string;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const metadata = user.publicMetadata || {};

  console.log(blockSpectators && metadata.isSpectator !== true);

  if (blockSpectators && metadata.isSpectator === true) {
    redirect(blockSpectators);
  }

  if (checkOnboarded && metadata.onboarded !== true) {
    redirect('/onboarding');
  }

  if (forAdmin && metadata.role !== 'admin') {
    redirect('/');
  }

  return children;
}
