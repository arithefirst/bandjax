import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

export type Exercise = {
  name: string;
  scoringType: 'perRep' | 'perMin';
  pointsPer: number;
  id: string;
};

// Section table
export const sections = pgTable('section', {
  slug: text('slug').primaryKey(),
  displayName: text('display_name').notNull(),
  bio: text('bio').notNull().default(''),
  imageUrl: text('image_url').notNull(),
  score: integer('score').notNull().default(0),
  exercises: jsonb('exercises').notNull().$type<Exercise[]>().default([]),
  members: jsonb('members').notNull().$type<string[]>().default([]),
  // ^ We can't use relations here since clerk dosen't
  // store users in the database
});

export type SectionsType = typeof sections.$inferSelect;
