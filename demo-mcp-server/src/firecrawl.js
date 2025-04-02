import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import FireCrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

const app = new FireCrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export const server = new McpServer({
  name: "My Firecrawl MCP Server",
  version: "1.0.0",
});

server.tool("crawlWeb", "Crawl web for information", async () => {
  console.error("Crawling web");
  const scrapeResult = await app.scrapeUrl("https://docs.mendable.ai", {
    formats: ["json"],
  });

  console.log(scrapeResult);

  return { content: [{ type: "text", text: scrapeResult }] };
});
