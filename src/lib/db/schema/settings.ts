import {
    pgTable,
    uuid,
    varchar,
    jsonb,
    timestamp,
} from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value"),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});
