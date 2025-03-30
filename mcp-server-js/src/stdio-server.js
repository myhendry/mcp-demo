import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server-logic.js";

const transport = new StdioServerTransport();
await server.connect(transport);
