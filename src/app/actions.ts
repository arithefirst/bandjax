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

/**
 * Adds a new exercise to a specified section
 *
 * @param sectionSlug - The slug identifier of the section to add the exercise to
 * @param exercise - The exercise object to be added
 * @throws When user is not authenticated or doesn't have admin role
 * @throws When an exercise with the same name already exists in the section
 */
export async function addExercise(sectionSlug: string, exercise: Exercise) {
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

/**
 * Updates an existing exercise in a specified section
 *
 * @param sectionSlug - The slug identifier of the section containing the exercise
 * @param exercise - The updated exercise object with the same ID as the original
 * @throws When user is not authenticated or doesn't have admin role
 * @throws When another exercise with the same name exists in the section
 * @throws When the exercise to update cannot be found
 */
export async function updateExercise(sectionSlug: string, exercise: Exercise) {
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
