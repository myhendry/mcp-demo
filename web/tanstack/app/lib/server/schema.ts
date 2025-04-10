import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const Post = pgTable(
  "Post",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      // Unique index on 'id' (primary key is automatically indexed)
      postPkey: uniqueIndex("Post_pkey").on(table.id),
      // BTREE index on 'name'
      nameIdx: uniqueIndex("Post_name_idx").on(table.name),
    };
  }
);
