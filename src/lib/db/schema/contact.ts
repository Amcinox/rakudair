import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const contactStatusEnum = pgEnum("contact_status", [
    "new",
    "read",
    "replied",
]);

export const contactSubmissions = pgTable("contact_submissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }),
    message: text("message").notNull(),
    status: contactStatusEnum("status").default("new").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
