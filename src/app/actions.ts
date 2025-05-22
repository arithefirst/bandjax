'use server';

import { db } from '@/db';
import { sections } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function getSectionSlug() {
  const authData = await auth();
  if (!authData.userId) throw new Error('Not authorized');

  const userSection = await db
    .select()
    .from(sections)
    .where(sql`${sections.members} @> ${JSON.stringify([authData.userId])}`);
  return userSection[0].slug;
}
