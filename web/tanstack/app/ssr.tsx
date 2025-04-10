// app/ssr.tsx
/*
    As TanStack Start is an SSR framework, we need to pipe this router information to our server entry point:
    This allows us to know what routes and loaders we need to execute when the user hits a given route.
*/

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";
import { getRouterManifest } from "@tanstack/start/router-manifest";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
