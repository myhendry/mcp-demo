// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Button } from "@/components/ui/button";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/demo")({
  component: Demo,
  loader: async () => await getCount(),
});

function Demo() {
  const router = useRouter();
  const state = Route.useLoaderData();

  const handleClick = () => {
    console.log("Say Hello");
  };

  return (
    <>
      <div className="flex gap-4">
        <Link to="/demo">Demo</Link>
        <Link to="/chat">Chat</Link>
      </div>
      <Button onClick={handleClick}>Click me</Button>
      <button
        type="button"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1 to {state}?
      </button>
    </>
  );
}
