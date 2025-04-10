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

// server.tool("crawlWeb", "Crawl web for firecrawl information", async () => {
//   console.error("Crawling web");
//   const scrapeResult = await app.scrapeUrl(
//     "https://docs.firecrawl.dev/introduction",
//     {
//       formats: ["markdown"],
//     }
//   );

//   console.log(scrapeResult.markdown);

//   return { content: [{ type: "text", text: scrapeResult }] };
// });

server.tool("crawlWeb", "Crawl web for firecrawl information", {
  parameters: z.object({
    url: z.string().describe("The URL to crawl"),
    formats: z
      .array(z.string())
      .optional()
      .describe("Output formats (e.g., ['markdown'])"),
  }),
  handler: async ({ url, formats = ["markdown"] }) => {
    console.log("Crawling web:", url);
    const scrapeResult = await app.scrapeUrl(url, {
      formats,
    });

    return {
      content: [
        {
          type: "text",
          text: scrapeResult.markdown,
        },
      ],
    };
  },
});
