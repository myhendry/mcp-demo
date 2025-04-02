import { experimental_createMCPClient, streamText, tool } from "ai";
// import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  try {
    const sseClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "http://localhost:8081/sse",
      },
      name: "Demo MCP",
    });

    const toolSet = await sseClient.tools();

    const tools = {
      ...toolSet,
    };

    const response = await streamText({
      model: openai("gpt-4o-mini"),
      tools,
      prompt,
      onFinish: async () => {
        await sseClient.close();
      },
    });

    return response.toDataStreamResponse();
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
