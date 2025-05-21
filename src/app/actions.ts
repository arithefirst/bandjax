'use server';

import { db } from '@/db';
import { sections } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function getSectionSlug(userId: string) {
  const userSection = await db
    .select()
    .from(sections)
    .where(sql`${sections.members} @> ${JSON.stringify([userId])}`);
  return userSection[0].slug;
}
