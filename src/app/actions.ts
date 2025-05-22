'use server';

import { db } from '@/db';
import { sections } from '@/db/schema';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { sql } from 'drizzle-orm';

export async function getSectionSlug() {
  const authData = await auth();
  if (!authData.userId) throw new Error('Not authorized');

  const userSection = await db
    .select()
    .from(sections)
    .where(sql`${sections.members} @> ${JSON.stringify([authData.userId])}`);
  return userSection[0].slug;
}

export async function upgradeUserToAdmin(newAdminId: string) {
  const ctx = await clerkClient();
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Not authorized');

  await ctx.users.updateUserMetadata(newAdminId, {
    publicMetadata: {
      role: 'admin',
    },
  });
}
