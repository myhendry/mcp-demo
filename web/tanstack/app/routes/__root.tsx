/// <reference types="vite/client" />

/*
    Finally, we need to create the root of our application. This is the entry point for all other routes. 
    The code in this file will wrap all other routes in the application.
*/
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { ActivityIcon, LayoutDashboardIcon } from "lucide-react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "@/styles/app.css?url";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/server/user";
import { DefaultCatchBoundary } from "@/components/defaultCatchBoundary";
import { NotFound } from "@/components/notFound";
import { getThemeServerFn } from "@/lib/theme";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const userId = await getUserId();
    return { userId };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter Demo",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  loader: () => getThemeServerFn(),
});

function RootComponent() {
  const data = Route.useLoaderData();

  return (
    <ClerkProvider>
      <ThemeProvider theme={data}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ThemeProvider>
    </ClerkProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <html className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-regular antialiased tracking-wide">
        <nav className="p-2 flex gap-2 text-lg items-center">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            <ActivityIcon />
          </Link>
          <Link to="/demo">Demo</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/dashboard">Dashboard</Link>
          <ModeToggle />
          <SignedOut>
            <div className="flex">
              <Button
                asChild
                variant={"link"}
                className="text-lg cursor-pointer"
              >
                <SignInButton />
              </Button>
              <div className="w-[1px] h-8 bg-zinc-200"></div>
              <Button
                asChild
                variant={"link"}
                className="text-lg cursor-pointer"
              >
                <SignUpButton />
              </Button>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton
              showName
              appearance={{
                elements: { userButtonOuterIdentifier: { color: "wheat" } },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Dashboard"
                  labelIcon={<LayoutDashboardIcon size={16} />}
                  onClick={() => navigate({ to: "/dashboard" })}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </nav>
        {children}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
