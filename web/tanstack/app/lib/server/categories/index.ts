import { createServerFn } from "@tanstack/react-start";

import { categoriesTable, transactionsTable } from "@/lib/db/schema";
import { db } from "@/lib/db/config";
import { z } from "zod";
import { addDays } from "date-fns";
import authMiddleware from "auth-middleware";

const transactionSchema = z.object({
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1);
  }),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must contain a maximum of 300 characters"),
});

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  const categories = await db.select().from(categoriesTable);
  return categories;
});

export const createTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchema>) =>
    transactionSchema.parse(data)
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;

    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();

    return transaction;
  });
