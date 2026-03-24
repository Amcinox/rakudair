CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'scheduled', 'archived');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."page_template" AS ENUM('default', 'full-width', 'contact', 'blank');--> statement-breakpoint
CREATE TYPE "public"."subscriber_status" AS ENUM('active', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'replied');--> statement-breakpoint
CREATE TYPE "public"."nav_position" AS ENUM('header', 'footer', 'social');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" jsonb,
	"content_html" text,
	"cover_image" text,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"scheduled_at" timestamp,
	"author_id" varchar(255) NOT NULL,
	"category_id" uuid,
	"reading_time" integer,
	"is_featured" boolean DEFAULT false NOT NULL,
	"locale" varchar(10) DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" jsonb,
	"content_html" text,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"template" "page_template" DEFAULT 'default' NOT NULL,
	"show_in_nav" boolean DEFAULT false NOT NULL,
	"nav_order" integer DEFAULT 0 NOT NULL,
	"locale" varchar(10) DEFAULT 'en' NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"color" varchar(7),
	"icon" varchar(50),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"article_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "article_tags_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(30) NOT NULL,
	"entity_id" uuid,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"meta_keywords" text[],
	"og_title" varchar(120),
	"og_description" varchar(320),
	"og_image" text,
	"og_type" varchar(30) DEFAULT 'website',
	"twitter_card" varchar(30) DEFAULT 'summary_large_image',
	"twitter_title" varchar(120),
	"twitter_description" varchar(320),
	"twitter_image" text,
	"canonical_url" text,
	"no_index" boolean DEFAULT false NOT NULL,
	"no_follow" boolean DEFAULT false NOT NULL,
	"json_ld" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_metadata_entity_type_entity_id_unique" UNIQUE("entity_type","entity_id")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"key" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" varchar(255),
	"uploaded_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100),
	"status" "subscriber_status" DEFAULT 'active' NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	"source" varchar(50) DEFAULT 'blog' NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255),
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "navigation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"target" varchar(10) DEFAULT '_self' NOT NULL,
	"position" "nav_position" DEFAULT 'header' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"parent_id" uuid,
	"page_id" uuid,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_path" varchar(500) NOT NULL,
	"to_path" varchar(500) NOT NULL,
	"type" integer DEFAULT 301 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;