import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CheckOnboarding } from '../onboardForm';
import { db } from '@/db';
import { sections } from '@/db/schema';

export async function ProtectRSC({
  children,
  forAdmin = false,
  blockSpectators = null,
}: {
  children: React.ReactNode;
  forAdmin?: boolean;
  blockSpectators?: null | string;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const metadata = user.publicMetadata || {};

  if (blockSpectators && metadata.isSpectator === true) {
    redirect(blockSpectators);
  }

  if (forAdmin && metadata.role !== 'admin') {
    redirect('/');
  }

  const sectionData = (await db.select().from(sections)).map((s) => ({ value: s.slug, label: s.displayName }));

  return (
    <>
      {children}
      <CheckOnboarding sections={sectionData} />
    </>
  );
}
