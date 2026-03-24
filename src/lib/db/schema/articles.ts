import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    timestamp,
    integer,
    boolean,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { articleTags } from "./tags";
import { seoMetadata } from "./seo";

export const articleStatusEnum = pgEnum("article_status", [
    "draft",
    "published",
    "scheduled",
    "archived",
]);

export const articles = pgTable("articles", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: jsonb("content"),
    contentHtml: text("content_html"),
    coverImage: text("cover_image"),
    status: articleStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),
    authorId: varchar("author_id", { length: 255 }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    readingTime: integer("reading_time"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    locale: varchar("locale", { length: 10 }).default("en").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
    category: one(categories, {
        fields: [articles.categoryId],
        references: [categories.id],
    }),
    articleTags: many(articleTags),
    seo: one(seoMetadata, {
        fields: [articles.id],
        references: [seoMetadata.entityId],
    }),
}));
