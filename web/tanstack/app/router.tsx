// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/*
    This is the file that will dictate the behavior of TanStack Router used within Start.
    Here, you can configure everything from the default preloading functionality to caching staleness.
*/
export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
