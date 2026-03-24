import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { articles } from "./articles";

export const tags = pgTable("tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articleTags = pgTable(
    "article_tags",
    {
        articleId: uuid("article_id")
            .notNull()
            .references(() => articles.id, { onDelete: "cascade" }),
        tagId: uuid("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

export const tagsRelations = relations(tags, ({ many }) => ({
    articleTags: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
    article: one(articles, {
        fields: [articleTags.articleId],
        references: [articles.id],
    }),
    tag: one(tags, {
        fields: [articleTags.tagId],
        references: [tags.id],
    }),
}));
