import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

// Section table
export const sections = pgTable('section', {
  slug: text('slug').primaryKey(),
  displayName: text('display_name').notNull(),
  bio: text('bio').notNull(),
  imageUrl: text('image_url').notNull(),
  score: integer('score').notNull().default(0),
  members: jsonb('members').notNull().$type<string[]>(),
  // ^ We can't use relations here since clerk dosen't
  // store users in the database
});
