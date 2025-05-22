'use server';

import { db } from '@/db';
import { Exercise, sections } from '@/db/schema';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSectionSlug() {
  const authData = await auth();
  if (!authData.userId) throw new Error('Not authorized');

  const userSection = await db
    .select()
    .from(sections)
    .where(sql`${sections.members} @> ${JSON.stringify([authData.userId])}`);
  return userSection[0].slug;
}

// ###################
// # Admin Functions #
// ###################

/**
 * Upgrades a user to admin
 * @param newAdminId Clerk UID of the user to be upgraded
 * @returns Full Name of upgraded user
 */
export async function upgradeUserToAdmin(newAdminId: string): Promise<string> {
  const ctx = await clerkClient();
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Not authorized');

  await ctx.users.updateUserMetadata(newAdminId, {
    publicMetadata: {
      role: 'admin',
    },
  });

  return (await ctx.users.getUser(newAdminId)).fullName || newAdminId;
}

export async function addExersice(sectionSlug: string, exercise: Exercise) {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Not authorized');

  const sectionData = (await db.select().from(sections).where(eq(sections.slug, sectionSlug)))[0];
  if (!sectionData.exercises.find((e) => e.name === exercise.name)) {
    const newExercises = [...sectionData.exercises, exercise];
    await db
      .update(sections)
      .set({
        exercises: newExercises,
      })
      .where(eq(sections.slug, sectionSlug));
  } else {
    throw new Error('Duplicate Name');
  }
}

export async function updateExersice(sectionSlug: string, exercise: Exercise) {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Not authorized');

  const sectionData = (await db.select().from(sections).where(eq(sections.slug, sectionSlug)))[0];

  // Check if a duplicate name exists
  const duplicateExists = sectionData.exercises.find((e) => e.name === exercise.name && e.id !== exercise.id);

  if (!duplicateExists) {
    const exerciseIndex = sectionData.exercises.findIndex((e) => e.id === exercise.id);

    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
    }

    const newExercises = [...sectionData.exercises]; // Create a copy to avoid mutation
    newExercises[exerciseIndex] = exercise;

    await db
      .update(sections)
      .set({
        exercises: newExercises,
      })
      .where(eq(sections.slug, sectionSlug));

    revalidatePath('/admin');
  } else {
    throw new Error('Duplicate Name');
  }
}
