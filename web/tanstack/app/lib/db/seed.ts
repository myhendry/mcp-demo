import { db } from "./config";
import { categoriesTable } from "./schema";

const categoriesSeedData: (typeof categoriesTable.$inferInsert)[] = [
  {
    name: "Salary",
    type: "income",
  },
  {
    name: "Rental Income",
    type: "income",
  },
  {
    name: "Business Income",
    type: "income",
  },
  {
    name: "Investments",
    type: "income",
  },
  {
    name: "Other",
    type: "income",
  },
  {
    name: "Housing",
    type: "expense",
  },
  {
    name: "Transport",
    type: "expense",
  },
  {
    name: "Food & Groceries",
    type: "expense",
  },
  {
    name: "Health",
    type: "expense",
  },
  {
    name: "Entertainment & Leisure",
    type: "expense",
  },
  {
    name: "Other",
    type: "expense",
  },
];

async function main() {
  await db.insert(categoriesTable).values(categoriesSeedData);
}

main();
