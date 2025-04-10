import { db } from "@/lib/server";
import { createServerFn } from "@tanstack/start";

export const getPosts = createServerFn({ method: "GET" }).handler(
  async ({ data }) => {
    await new Promise((res) => setTimeout(res, 1500));
    const s = performance.now();
    const posts = await db.query.Post.findMany();
    const e = performance.now();
    const f = (s - e).toFixed(2) + "ms";
    if (!posts) throw new Error("wooo");
    return { posts, f };
  }
);
