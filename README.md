# TODOS

- [x] MCP Tools with Vercel AI SDK
- [x] Vercel AI with Fastapi (https://github.com/myhendry/proprag-server/blob/main/routers/llm.py)
- [x] [Fastapi with Pydantic AI](https://www.youtube.com/watch?v=6yebvAqbFvI&t=880s)
- [ ] Fastapi + Pydantic AI + Nextjs
- [ ] Pydantic AI with MCP

# GETTING STARTED

_Remember to set the specific api variable in your vercel/ai's useChat at web/next/src/app/page.tsx to point to the correct server_

_You can also set your preferred choice of llm at web/next/src/api/chat/route.ts_

## For Fastapi + Pydantic AI + Nextjs

```
bun run dev:pydantic

<!-- fastapi dev main.py -->

```

## For Vercel/ai and MCP

Go to web/next

```
bun run dev:mcp // the script will run all the folders using concurrently

```

## To run separately (not recommended)

```
<!-- frontend -->

bun run dev

```

```
<!-- api-fulfillment -->

bun run dev

```

```
<!-- api-products -->

bun run dev

```

```
<!-- mcp-server-js -->

node src/sse-server.js

node src/stdio-server.js

```

```
<!-- demo-mcp-server -->

node src/server.js

```
