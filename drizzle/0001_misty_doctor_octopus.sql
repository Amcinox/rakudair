CREATE TABLE "author_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"bio" text,
	"avatar_url" text,
	"role" varchar(100),
	"location" varchar(255),
	"website" varchar(500),
	"social_twitter" varchar(500),
	"social_instagram" varchar(500),
	"social_youtube" varchar(500),
	"social_facebook" varchar(500),
	"social_tiktok" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
