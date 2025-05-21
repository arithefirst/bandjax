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

  if (sectionQuery.length === 0) notFound();
  const { imageUrl, displayName, bio, score, members } = sectionQuery[0];

  return (
    <ProtectRSC>
      <main className="flex h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex w-full flex-1 flex-col overflow-scroll">
          <div className="from-primary/80 to-primary relative flex h-1/6 w-full flex-col-reverse bg-gradient-to-br px-2">
            <Link href="/leaderboard" className="bg-background/30 absolute top-2 left-2 rounded-full p-2">
              <ChevronLeft />
            </Link>
            <Avatar className="border-background h-24 w-24 translate-y-12 border-6 shadow-sm">
              <AvatarImage src={imageUrl} alt={displayName} />
              <AvatarFallback className="text-2xl">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 px-4 pt-12">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <span className="bg-primary/10 text-primary ml-auto flex items-center rounded-full px-3 py-1 text-sm font-medium">
                Score: {score.toLocaleString()}
              </span>
            </div>
            <h2 className="text-muted-foreground leading-5 italic">@{slug}</h2>
            <p className="mt-2 indent-4">{bio}</p>
            <hr className="my-3" />
            <h2 className="text-lg">Members</h2>
            <div className="mt-1 grid grid-cols-1 gap-1">
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
