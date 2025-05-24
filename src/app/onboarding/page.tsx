import { Header } from '@/components/header';
import { ProtectRSC } from '@/components/protect/server';
import { OnboardingForm } from '@/components/onboardForm';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const sectionData = await db.select().from(sections);
  const comboboxSections = sectionData.map((s) => ({ value: s.slug, label: s.displayName }));
  const user = await currentUser();

  if (user && user.publicMetadata.onboarded === true) {
    redirect('/');
  }

  return (
    <ProtectRSC>
      <main className="flex min-h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex w-full flex-1 items-center justify-center p-4">
          <OnboardingForm sections={comboboxSections} />
        </div>
      </main>
    </ProtectRSC>
  );
}
