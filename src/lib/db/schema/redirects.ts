import {
    pgTable,
    uuid,
    varchar,
    integer,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const redirects = pgTable("redirects", {
    id: uuid("id").defaultRandom().primaryKey(),
    fromPath: varchar("from_path", { length: 500 }).notNull(),
    toPath: varchar("to_path", { length: 500 }).notNull(),
    type: integer("type").default(301).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
