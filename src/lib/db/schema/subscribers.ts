import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const subscriberStatusEnum = pgEnum("subscriber_status", [
    "active",
    "unsubscribed",
]);

export const subscribers = pgTable("subscribers", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 100 }),
    status: subscriberStatusEnum("status").default("active").notNull(),
    subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
    unsubscribedAt: timestamp("unsubscribed_at"),
    source: varchar("source", { length: 50 }).default("blog").notNull(),
});
