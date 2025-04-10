import { getPosts } from "@/lib/server/posts/get-posts";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

const homeSearchSchema = z.object({
  page: z.number(),
  filter: z.string(),
});

type homeSearch = z.infer<typeof homeSearchSchema>;

export const Route = createFileRoute("/")({
  component: RouteComponent,
  // using server functions
  //todo can also not block page render by loading the data in a separate component. refer https://youtu.be/HDdHKrHdd-o?si=VtPAZUdU2P1IlVnt&t=1151
  loader: async () => await getPosts(),
  //* validate searchParams
  // validateSearch: (search) => homeSearchSchema.parse(search),
});

function RouteComponent() {
  // const { filter, page } = Route.useSearch();
  const { posts, f } = Route.useLoaderData();
  return (
    <div>
      Hello!
      <div className="flex gap-4">
        <Link to="/demo">Demo</Link>
        <Link to="/chat">Chat</Link>
      </div>
      <div className="p-12">
        <ul>
          {posts.map((p) => (
            <li key={p.id}>
              {p.id} {p.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
