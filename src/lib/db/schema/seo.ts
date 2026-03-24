import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    timestamp,
    boolean,
    unique,
} from "drizzle-orm/pg-core";

export const seoMetadata = pgTable(
    "seo_metadata",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        entityType: varchar("entity_type", { length: 30 }).notNull(),
        entityId: uuid("entity_id"),
        metaTitle: varchar("meta_title", { length: 120 }),
        metaDescription: varchar("meta_description", { length: 320 }),
        metaKeywords: text("meta_keywords").array(),
        ogTitle: varchar("og_title", { length: 120 }),
        ogDescription: varchar("og_description", { length: 320 }),
        ogImage: text("og_image"),
        ogType: varchar("og_type", { length: 30 }).default("website"),
        twitterCard: varchar("twitter_card", { length: 30 }).default(
            "summary_large_image"
        ),
        twitterTitle: varchar("twitter_title", { length: 120 }),
        twitterDescription: varchar("twitter_description", { length: 320 }),
        twitterImage: text("twitter_image"),
        canonicalUrl: text("canonical_url"),
        noIndex: boolean("no_index").default(false).notNull(),
        noFollow: boolean("no_follow").default(false).notNull(),
        jsonLd: jsonb("json_ld"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (t) => [unique().on(t.entityType, t.entityId)]
);
