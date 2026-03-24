import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

export const media = pgTable("media", {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    key: text("key").notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: varchar("alt_text", { length: 255 }),
    uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
