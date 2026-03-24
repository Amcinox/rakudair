import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { articles } from "./articles";

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    color: varchar("color", { length: 7 }),
    icon: varchar("icon", { length: 50 }),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    articles: many(articles),
}));
