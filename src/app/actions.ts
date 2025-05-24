'use server';

import { db } from '@/db';
import { Exercise, globalSettings, sections, SectionsType } from '@/db/schema';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function isScoreAveragingEnabled(): Promise<boolean> {
  const settings = await db.select().from(globalSettings).where(eq(globalSettings.setting, 'avg_scores'));
  if (settings.length === 0) return false;
  if (settings[0].enable) return true;
  return false;
}

export async function getSectionSlug() {
  const authData = await auth();
  if (!authData.userId) throw new Error('Section slug retrieval not authorized');

  const userSection = await db
    .select()
    .from(sections)
    // Drizzle auto-escapes this SQL
    .where(sql`${sections.members} @> ${JSON.stringify([authData.userId])}`);
  return userSection.length >= 1 ? userSection[0].slug : null;
}

export async function onboardUser(sectionSlug: string) {
  const ctx = await clerkClient();
  const authData = await auth();
  if (!authData.userId) throw new Error('Onboarding Not authorized');

  if (sectionSlug === 'spectator') {
    await ctx.users.updateUserMetadata(authData.userId, {
      publicMetadata: {
        onboarded: true,
        isSpectator: true,
      },
    });
  } else {
    // Use a transaction to prevent race conditions
    await db.transaction(async (tx) => {
      const sectionData = await tx.select().from(sections).where(eq(sections.slug, sectionSlug));
      const memberCt = sectionData[0].members.length + 1;

      await tx
        .update(sections)
        .set({
          members: [...sectionData[0].members, authData.userId],
          // Update the avg score here because changing the count of users
          // should also change the average of the points per user
          averageScore: Math.floor(sectionData[0].score / (memberCt === 0 ? 1 : memberCt)),
        })
        .where(eq(sections.slug, sectionSlug));
    });

    await ctx.users.updateUserMetadata(authData.userId, {
      publicMetadata: {
        onboarded: true,
      },
    });
  }
}

export async function logExercise(section: SectionsType, exerciseId: string, count: number) {
  const user = await currentUser();
  if (!user) throw new Error('Log Exercise Not authorized');

  // Re-fetching here because the data could have changed since the user's page load
  await db.transaction(async (tx) => {
    const sectionData = await tx.select().from(sections).where(eq(sections.slug, section.slug));
    if (!sectionData[0].members.includes(user.id)) throw new Error('Log Exercise Not authorized');

    const exercise = sectionData[0].exercises.find((e) => e.id === exerciseId);
    if (!exercise) throw new Error('Exercise does not exist');
    const newScore = sectionData[0].score + exercise.pointsPer * count;
    const memberCt = sectionData[0].members.length;

    await tx
      .update(sections)
      .set({
        score: newScore,
        averageScore: Math.floor(newScore / (memberCt === 0 ? 1 : memberCt)),
      })
      .where(eq(sections.slug, section.slug));
  });

  revalidatePath('/');
  revalidatePath('/leaderboard');
}

// ###################
// # Admin Functions #
// ###################

export async function setGlobalSetting(setting: string, value: boolean) {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Set Global Setting Not authorized');

  await db
    .insert(globalSettings)
    .values({
      enable: value,
      setting: setting,
    })
    .onConflictDoUpdate({
      target: globalSettings.setting,
      set: {
        enable: value,
      },
    });
}

/**
 * Upgrades a user to admin
 * @param newAdminId Clerk UID of the user to be upgraded
 * @returns Full Name of upgraded user
 */
export async function upgradeUserToAdmin(newAdminId: string): Promise<string> {
  const ctx = await clerkClient();
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Admin Upgrade Not authorized');

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
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Add Exercise Not authorized');

  await db.transaction(async (tx) => {
    const sectionData = (await tx.select().from(sections).where(eq(sections.slug, sectionSlug)))[0];
    if (!sectionData.exercises.find((e) => e.name.toLocaleLowerCase() === exercise.name.toLocaleLowerCase())) {
      const newExercises = [...sectionData.exercises, exercise];
      await tx
        .update(sections)
        .set({
          exercises: newExercises,
        })
        .where(eq(sections.slug, sectionSlug));
    } else {
      throw new Error('Duplicate Name');
    }
  });
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
  if (!user || user.publicMetadata.role !== 'admin') throw new Error('Update Exercise Not authorized');

  await db.transaction(async (tx) => {
    const sectionData = (await tx.select().from(sections).where(eq(sections.slug, sectionSlug)))[0];

    // Check if a duplicate name exists
    const duplicateExists = sectionData.exercises.find(
      (e) => e.name.toLowerCase() === exercise.name.toLowerCase() && e.id !== exercise.id,
    );

    if (!duplicateExists) {
      const exerciseIndex = sectionData.exercises.findIndex((e) => e.id === exercise.id);

      if (exerciseIndex === -1) {
        throw new Error('Exercise not found');
      }

      const newExercises = [...sectionData.exercises]; // Create a copy to avoid mutation
      newExercises[exerciseIndex] = exercise;

      await tx
        .update(sections)
        .set({
          exercises: newExercises,
        })
        .where(eq(sections.slug, sectionSlug));

      revalidatePath('/admin');
    } else {
      throw new Error('Duplicate Name');
    }
  });
}
