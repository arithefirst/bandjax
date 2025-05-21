CREATE TABLE "section" (
	"slug" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"bio" text NOT NULL,
	"image_url" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL
);
