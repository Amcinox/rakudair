import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const navPositionEnum = pgEnum("nav_position", [
    "header",
    "footer",
    "social",
]);

export const navigation = pgTable("navigation", {
    id: uuid("id").defaultRandom().primaryKey(),
    label: varchar("label", { length: 100 }).notNull(),
    url: text("url").notNull(),
    target: varchar("target", { length: 10 }).default("_self").notNull(),
    position: navPositionEnum("position").default("header").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    parentId: uuid("parent_id"),
    pageId: uuid("page_id"),
    isVisible: boolean("is_visible").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const navigationRelations = relations(navigation, ({ one }) => ({
    parent: one(navigation, {
        fields: [navigation.parentId],
        references: [navigation.id],
    }),
}));
