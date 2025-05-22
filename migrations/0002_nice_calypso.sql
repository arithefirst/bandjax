ALTER TABLE "section" ALTER COLUMN "bio" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "members" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "section" ADD COLUMN "exercises" jsonb DEFAULT '[]'::jsonb NOT NULL;