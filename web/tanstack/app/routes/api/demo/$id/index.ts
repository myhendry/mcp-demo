// routes/api/demo/$id.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/demo/$id")({
  GET: async ({ request, params }) => {
    const { id } = params;
    return new Response(`Hello, World! from ${request.url} id: ${id}`);
  },
  POST: async ({ request, params }) => {
    const body = await request.json();
    const { id } = params;
    return new Response(
      `Hello, World! from request url: ${request.url} body: ${body.name} id: ${id}`
    );
  },
});
