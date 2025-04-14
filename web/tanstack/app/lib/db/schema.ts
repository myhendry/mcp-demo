import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const postsTable = pgTable(
  "Posts",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("Post_pkey").on(table.id), // Unique index on 'id' (primary key is automatically indexed)
    uniqueIndex("Post_name_idx").on(table.name), // BTREE index on 'name'
  ]
);

export const categoriesTable = pgTable("Categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  type: text({
    enum: ["income", "expense"],
  }).notNull(),
});

export const transactionsTable = pgTable("Transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  description: text().notNull(),
  amount: numeric().notNull(),
  transactionDate: date("transaction_date").notNull(),
  categoryId: integer("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
});
