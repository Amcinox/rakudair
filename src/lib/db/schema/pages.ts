import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    timestamp,
    boolean,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { seoMetadata } from "./seo";

export const pageStatusEnum = pgEnum("page_status", ["draft", "published"]);

export const pageTemplateEnum = pgEnum("page_template", [
    "default",
    "full-width",
    "contact",
    "blank",
]);

export const pages = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: jsonb("content"),
    contentHtml: text("content_html"),
    status: pageStatusEnum("status").default("draft").notNull(),
    template: pageTemplateEnum("template").default("default").notNull(),
    showInNav: boolean("show_in_nav").default(false).notNull(),
    navOrder: integer("nav_order").default(0).notNull(),
    locale: varchar("locale", { length: 10 }).default("en").notNull(),
    authorId: varchar("author_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const pagesRelations = relations(pages, ({ one }) => ({
    seo: one(seoMetadata, {
        fields: [pages.id],
        references: [seoMetadata.entityId],
    }),
}));
