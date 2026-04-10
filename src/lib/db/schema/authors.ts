import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    timestamp,
} from "drizzle-orm/pg-core";

export const authorProfiles = pgTable("author_profiles", {
    id: uuid("id").defaultRandom().primaryKey(),
    /** Clerk user ID — the foreign key to the auth provider */
    clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    bio: text("bio"),
    avatar: text("avatar"),
    role: varchar("role", { length: 100 }),
    location: varchar("location", { length: 255 }),
    website: varchar("website", { length: 500 }),
    socialTwitter: varchar("social_twitter", { length: 500 }),
    socialInstagram: varchar("social_instagram", { length: 500 }),
    socialYoutube: varchar("social_youtube", { length: 500 }),
    socialFacebook: varchar("social_facebook", { length: 500 }),
    socialTiktok: varchar("social_tiktok", { length: 500 }),
    socialGithub: varchar("social_github", { length: 500 }),
    /** Any additional metadata */
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});
