import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CheckOnboarding } from '../onboardForm';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { buttonVariants } from '../ui/button';
import Image from 'next/image';
import { asc } from 'drizzle-orm';

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
    return (
      <div className="mx-auto flex h-screen w-screen flex-col items-center justify-center gap-2">
        <div className="relative aspect-square w-1/3">
          <Image src="/favicon.png" alt="Bandjax logo" fill />
        </div>
        <SignInButton mode="modal" forceRedirectUrl="/leaderboard">
          <div className={buttonVariants({ size: 'lg' }) + ' w-11/12 cursor-pointer'}>Sign In</div>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/leaderboard">
          <div className={buttonVariants({ size: 'lg' }) + ' w-11/12 cursor-pointer'}>Sign Up</div>
        </SignUpButton>
      </div>
    );
  }

  const metadata = user.publicMetadata || {};

  if (blockSpectators && metadata.isSpectator === true) {
    redirect(blockSpectators);
  }

  if (forAdmin && metadata.role !== 'admin') {
    redirect('/');
  }

  const sectionData = (await db.select().from(sections).orderBy(asc(sections.displayName))).map((s) => ({
    value: s.slug,
    label: s.displayName,
  }));

  return (
    <>
      {children}
      <CheckOnboarding sections={sectionData} />
    </>
  );
}
