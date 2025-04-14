import { db } from "@/lib/db/config";
import { postsTable } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";

export const getPosts = createServerFn({ method: "GET" }).handler(
  async ({ data }) => {
    await new Promise((res) => setTimeout(res, 1500));
    const s = performance.now();
    // const posts = await db.query.postsTable.findMany();
    const posts = await db.select().from(postsTable);
    const e = performance.now();
    const f = (s - e).toFixed(2) + "ms";
    if (!posts) throw new Error("wooo");
    return { posts, f };
  }
);
