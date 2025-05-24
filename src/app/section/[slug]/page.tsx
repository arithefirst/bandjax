import { isScoreAveragingEnabled } from '@/app/actions';
import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { User } from '@clerk/backend';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sectionQuery = await db.select().from(sections).where(eq(sections.slug, slug)).limit(1);

  if (sectionQuery.length === 0) {
    return {
      title: 'Bandjax | Section Not Found',
    };
  }

  const { displayName } = sectionQuery[0];

  return {
    title: `Bandjax | ${displayName}`,
  };
}

function UserDisplay({ user }: { user: User }) {
  return (
    <div className="bg-input/30 border-input flex w-full items-center gap-2 rounded-lg border px-4 py-2">
      <Avatar className="h-9 w-9 shadow-sm">
        <AvatarImage src={user.imageUrl} alt={`${user.fullName}'s profile photo`} />
        <AvatarFallback>{(user.fullName || 'John Doe').substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span>{user.fullName}</span>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sectionQuery = await db.select().from(sections).where(eq(sections.slug, slug)).limit(1);
  const ctx = await clerkClient();
  const scoreAveraging = await isScoreAveragingEnabled();

  if (sectionQuery.length === 0) notFound();
  const { imageUrl, displayName, bio, score, members, averageScore } = sectionQuery[0];

  return (
    <ProtectRSC checkOnboarded>
      <main className="flex h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex w-full flex-1 flex-col overflow-y-scroll pb-2">
          <div className="from-primary/80 to-primary relative flex h-1/6 w-full flex-col-reverse bg-gradient-to-br px-2">
            <Link href="/leaderboard" className="bg-background/30 absolute top-2 left-2 rounded-full p-2">
              <ChevronLeft />
            </Link>
            <Avatar className="border-background h-24 w-24 translate-y-12 border-6 shadow-sm">
              <AvatarImage src={imageUrl} alt={displayName} />
              <AvatarFallback className="text-2xl">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="relative flex-1 px-4 pt-12">
            <span className="bg-primary/10 text-primary absolute top-3 right-3 ml-auto flex flex-col items-center rounded-md px-3 py-1 text-sm font-medium">
              <span className="flex">
                Score:{' '}
                <span className="ml-1 font-bold">{(scoreAveraging ? averageScore : score).toLocaleString()}</span>
              </span>
            </span>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{displayName}</h1>
            </div>
            <h2 className="text-muted-foreground leading-5 italic">@{slug}</h2>
            <p className="mt-2 indent-4">{bio}</p>
            <hr className="my-3" />
            <h2 className="text-lg">Members</h2>
            <div className="mt-2 grid grid-cols-1 gap-1">
              {members.map(async (id) => {
                const user = await ctx.users.getUser(id);
                return <UserDisplay key={id} user={user} />;
              })}
            </div>
          </div>
        </div>
        <Navbar active="leaderboard" />
      </main>
    </ProtectRSC>
  );
}
