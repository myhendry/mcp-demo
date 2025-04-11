# TODOS

- [x] MCP Tools with Vercel AI SDK
- [x] Vercel AI with Fastapi (https://github.com/myhendry/proprag-server/blob/main/routers/llm.py)
- [x] [Fastapi with Pydantic AI](https://www.youtube.com/watch?v=6yebvAqbFvI&t=880s)
- [ ] Fastapi + Pydantic AI + Nextjs
- [ ] Pydantic AI with MCP

# GETTING STARTED

_For Fastapi + Pydantic AI + Nextjs_

```
fastapi dev main.py

```

_For Vercel AI SDK_

Go to web/next

```
bun run dev:mcp // the script will run all the folders using concurrently


```

_To run the files and folders independently (not recommended)_

```
// frontend

bun run dev

```

```

// api-fulfillment

bun run dev

```

```

// api-products

bun run dev

```

```

// mcp-server-js

node src/sse-server.js

node src/stdio-server.js

```

```

// demo-mcp-server

node src/server.js

```
