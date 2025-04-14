import { createAPIFileRoute } from "@tanstack/react-start/api";
import { experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const APIRoute = createAPIFileRoute("/api/mcp")({
  POST: async ({ request }) => {
    const { messages } = await request.json();
    console.log("✅ MESSAGES", messages);

    try {
      const mcpClient = await experimental_createMCPClient({
        transport: {
          type: "sse",
          url: "http://localhost:8081/sse",
        },
      });

      const tools = await mcpClient.tools();

      console.log("✅ TOOLS", tools);

      console.log("✅ Starting stream...");
      const response = await streamText({
        model: openai("gpt-4o-mini"),
        messages,
        // system: "You are a helpful AI assistant",
        system: `You are a helpful AI assistant. You have the tool to crawl the web for information by using the crawlWeb tool.`,
        tools: await mcpClient.tools(),
        onFinish: async () => {
          console.log("Stream finished, closing client");
          await mcpClient.close();
        },
      });

      console.log("Returning response stream");
      const streamResponse = response.toDataStreamResponse();
      console.log("STREAM RESPONSE", streamResponse);
      /*
      ! without mcp
      STREAM RESPONSE Response {
        status: 200,
        statusText: '',
        headers: Headers {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Vercel-AI-Data-Stream': 'v1'
        },
        body: ReadableStream { locked: false, state: 'readable', supportsBYOB: false },
        bodyUsed: false,
        ok: true,
        redirected: false,
        type: 'default',
        url: ''
      }
      */
      return streamResponse;
      // return json({ message: 'Hello "/api/mcp"!' });
    } catch (error) {
      console.error(error);
      // return json({ message: "Error" });
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
